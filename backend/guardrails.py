from typing import Dict, List

from policy_store import (
    get_policy_config,
    check_frequency,
)


# ============================================================
# RESPONSE BUILDER
# ============================================================

def build_response(
    decision: str,
    reason: str,
    checks: list
):

    risk_map = {
        "approved": "low",
        "human_review": "medium",
        "blocked": "high"
    }

    return {
        "decision": decision,
        "reason": reason,
        "riskLevel": risk_map[decision],
        "checks": checks
    }


# ============================================================
# DEMO STATE
# ============================================================

today_spend = 650


# ============================================================
# PROVIDER CHECK
# ============================================================

def check_provider(provider: str):

    config = get_policy_config()

    if not config["guardrails_enabled"]["provider_allow_list"]:
        return (
            True,
            "Provider allow list guardrail is disabled."
        )

    allowed_providers = config["allowed_providers"]

    if provider not in allowed_providers:
        return (
            False,
            "Provider is not on the allow list."
        )

    return (
        True,
        "Provider allowed."
    )


# ============================================================
# BUDGET CHECK
# ============================================================

def check_budget(amount: float):

    config = get_policy_config()

    if not config["guardrails_enabled"]["daily_budget"]:
        return (
            True,
            "Daily budget guardrail is disabled."
        )

    daily_budget = config["daily_budget"]

    if today_spend + amount > daily_budget:
        return (
            False,
            "Daily budget exceeded."
        )

    return (
        True,
        "Budget available."
    )

# ============================================================
# AMOUNT CHECK
# ============================================================

def check_amount(amount: float):

    config = get_policy_config()

    auto_enabled = config["guardrails_enabled"]["auto_approval_limit"]
    human_enabled = config["guardrails_enabled"]["human_review_limit"]

    auto_approve_limit = config["auto_approve_limit"]
    human_review_limit = config["human_review_limit"]

    # --------------------------------------------------------
    # Autonomous approval
    # --------------------------------------------------------

    if auto_enabled and amount <= auto_approve_limit:
        return (
            "approved",
            "Within auto approval limit."
        )

    # --------------------------------------------------------
    # Human review
    # --------------------------------------------------------

    if human_enabled and amount <= human_review_limit:
        return (
            "human_review",
            "Human approval required."
        )

    # --------------------------------------------------------
    # If both amount guardrails are disabled
    # --------------------------------------------------------

    if not auto_enabled and not human_enabled:
        return (
            "human_review",
            "Amount guardrails are disabled. Human review required."
        )

    # --------------------------------------------------------
    # Maximum limit
    # --------------------------------------------------------

    return (
        "blocked",
        "Amount exceeds maximum allowed limit."
    )

# ============================================================
# MAIN POLICY ENGINE
# ============================================================

def evaluate_payment(
    provider: str,
    amount: float
) -> Dict:

    checks: List[Dict] = []

    # --------------------------------------------------------
    # Provider
    # --------------------------------------------------------

    passed, message = check_provider(provider)

    checks.append({
        "policy": "Provider Allow List",
        "passed": passed,
        "message": message
    })

    if not passed:

        return build_response(
            "blocked",
            message,
            checks
        )

    # --------------------------------------------------------
    # Budget
    # --------------------------------------------------------

    passed, message = check_budget(amount)

    checks.append({
        "policy": "Daily Budget",
        "passed": passed,
        "message": message
    })

    if not passed:

        return build_response(
            "blocked",
            message,
            checks
        )

    # --------------------------------------------------------
    # Amount
    # --------------------------------------------------------

    decision, message = check_amount(amount)

    checks.append({
        "policy": "Amount Threshold",
        "passed": True,
        "message": message
    })

    return build_response(
        decision,
        message,
        checks
    )

def evaluate_payment(
    provider: str,
    amount: float
) -> Dict:

    checks: List[Dict] = []

    # --------------------------------------------------------
    # Frequency
    # --------------------------------------------------------

    passed, message = check_frequency()

    checks.append({
        "policy": "Request Frequency Limit",
        "passed": passed,
        "message": message
    })

    if not passed:
        return build_response(
            "blocked",
            message,
            checks
        )

    # --------------------------------------------------------
    # Provider
    # --------------------------------------------------------

    passed, message = check_provider(provider)

    checks.append({
        "policy": "Provider Allow List",
        "passed": passed,
        "message": message
    })

    if not passed:
        return build_response(
            "blocked",
            message,
            checks
        )

    # --------------------------------------------------------
    # Budget
    # --------------------------------------------------------

    passed, message = check_budget(amount)

    checks.append({
        "policy": "Daily Budget",
        "passed": passed,
        "message": message
    })

    if not passed:
        return build_response(
            "blocked",
            message,
            checks
        )

    # --------------------------------------------------------
    # Amount
    # --------------------------------------------------------

    decision, message = check_amount(amount)

    checks.append({
        "policy": "Amount Threshold",
        "passed": True,
        "message": message
    })

    return build_response(
        decision,
        message,
        checks
    )