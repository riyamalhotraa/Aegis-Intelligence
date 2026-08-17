"""
Ledger anchoring on Base Sepolia.

Why this exists:

The local ledger is a SHA-256 hash chain in a file written by the same process
that serves the API. That makes it tamper-*evident* only against an attacker
who does not also recompute the chain — which is anyone with write access to
the file. Calling that a blockchain invites exactly one question, and there is
no good answer to it.

Anchoring fixes the claim rather than the wording. Periodically we write the
current chain head to Base Sepolia. Rewriting local history now also requires
altering a record we do not control, which is what tamper-evidence was
supposed to mean in the first place.

Deliberately *not* implemented here: moving real funds. The problem we are
solving is the guard, not the rail, and a live value transfer is one more
thing that can fail in front of an audience.

Anchoring is optional. With no key configured it is skipped and reported as
disabled — we never claim an anchor we did not write.
"""

import json
from datetime import datetime, timezone
from typing import Dict, List, Optional

import config


BASE_SEPOLIA_CHAIN_ID = 84532

# Anchors written this process lifetime, newest last.
_anchors: List[Dict] = []


def _rpc(method: str, params: list) -> dict:
    import requests

    response = requests.post(
        config.CHAIN_RPC_URL,
        json={
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": params,
        },
        timeout=config.GUARD_REQUEST_TIMEOUT,
    )

    response.raise_for_status()
    payload = response.json()

    if "error" in payload:
        raise RuntimeError(payload["error"].get("message", "RPC error"))

    return payload["result"]


def status() -> Dict:
    """
    Honest description of the anchoring subsystem.
    """

    return {
        "enabled": config.ANCHORING_ENABLED,
        "chain": config.CHAIN_NAME,
        "anchorEvery": config.ANCHOR_EVERY,
        "anchorsWritten": len(_anchors),
        "latestAnchor": _anchors[-1] if _anchors else None,
        "note": (
            "Chain head is periodically written to "
            f"{config.CHAIN_NAME}."
            if config.ANCHORING_ENABLED
            else "Anchoring disabled: no AEGIS_CHAIN_PRIVATE_KEY configured. "
            "The ledger is hash-linked and tamper-evident locally, but not "
            "anchored on-chain."
        ),
    }


def get_anchors() -> List[Dict]:
    return list(_anchors)


def anchor_head(block_number: int, chain_head: str) -> Optional[Dict]:
    """
    Write a chain head to Base Sepolia as a zero-value self-transaction whose
    calldata carries the hash.

    Returns the anchor record, or None when anchoring is disabled or fails.
    Failure is never fatal: a guard that stops working because a testnet RPC
    is slow would be a poor trade.
    """

    if not config.ANCHORING_ENABLED:
        return None

    try:
        from eth_account import Account

        account = Account.from_key(config.CHAIN_PRIVATE_KEY)

        nonce = int(_rpc("eth_getTransactionCount", [account.address, "pending"]), 16)
        gas_price = int(_rpc("eth_gasPrice", []), 16)

        # The calldata is the payload: a tagged chain head, so an observer can
        # tell what the anchor refers to without our database.
        payload = json.dumps(
            {"aegis": "ledger-anchor", "block": block_number, "head": chain_head},
            separators=(",", ":"),
        ).encode("utf-8")

        transaction = {
            "nonce": nonce,
            "to": account.address,
            "value": 0,
            "gas": 25_000 + 16 * len(payload),
            "gasPrice": gas_price,
            "data": "0x" + payload.hex(),
            "chainId": BASE_SEPOLIA_CHAIN_ID,
        }

        signed = Account.sign_transaction(transaction, config.CHAIN_PRIVATE_KEY)
        raw = signed.raw_transaction if hasattr(signed, "raw_transaction") else signed.rawTransaction

        tx_hash = _rpc("eth_sendRawTransaction", ["0x" + raw.hex().removeprefix("0x")])

        record = {
            "blockNumber": block_number,
            "chainHead": chain_head,
            "txHash": tx_hash,
            "chain": config.CHAIN_NAME,
            "explorerUrl": f"{config.CHAIN_EXPLORER}{tx_hash}",
            "anchoredAt": datetime.now(timezone.utc).isoformat(),
        }

        _anchors.append(record)

        print(f"⚓ LEDGER ANCHORED: block {block_number} -> {tx_hash}")

        return record

    except Exception as exc:  # noqa: BLE001
        # Anchoring is best-effort. Never let it take the guard down.
        print(f"⚠️  ANCHOR FAILED (non-fatal): {exc!r}")
        return None
