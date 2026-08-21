import re
from typing import Any


# Fields that should never be accepted as normal payment metadata.
SENSITIVE_FIELD_NAMES = {
    "password",
    "passwd",
    "secret",
    "private_key",
    "privatekey",
    "api_key",
    "apikey",
    "access_token",
    "refresh_token",
    "authorization",
    "card_number",
    "cvv",
}


# Common sensitive-value patterns.

EMAIL_PATTERN = re.compile(
    r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b",
    re.IGNORECASE,
)

API_KEY_PATTERN = re.compile(
    r"\b(?:sk_live_|sk_test_|AKIA)[A-Za-z0-9_-]{8,}\b"
)

BEARER_PATTERN = re.compile(
    r"\bBearer\s+[A-Za-z0-9\-._~+/]+=*\b",
    re.IGNORECASE,
)


def inspect_payment_request(data: dict[str, Any]) -> dict[str, Any]:
    """
    Inspect payment/task metadata before it enters the
    AEGIS guardrail and payment flow.

    Returns:
        passed: whether the request can continue
        status: passed / warning / blocked
        sensitive_fields: detected sensitive field names
        detected_types: detected sensitive value types
        warnings: human-readable security findings
    """

    sensitive_fields: list[str] = []
    detected_types: list[str] = []
    warnings: list[str] = []

    # =========================================================
    # 1. Sensitive field-name detection
    # =========================================================

    for key in data.keys():

        normalized = key.lower().replace("-", "_")

        if normalized in SENSITIVE_FIELD_NAMES:
            sensitive_fields.append(key)

    # =========================================================
    # 2. Inspect string values
    # =========================================================

    for key, value in data.items():

        if not isinstance(value, str):
            continue

        # Email
        if EMAIL_PATTERN.search(value):
            if "email" not in detected_types:
                detected_types.append("email")

        # API key
        if API_KEY_PATTERN.search(value):
            if "api_key" not in detected_types:
                detected_types.append("api_key")

        # Bearer token
        if BEARER_PATTERN.search(value):
            if "authorization_token" not in detected_types:
                detected_types.append("authorization_token")

    # =========================================================
    # 3. Generate security findings
    # =========================================================

    if sensitive_fields:
        warnings.append(
            f"Sensitive fields detected: {', '.join(sensitive_fields)}"
        )

    if detected_types:
        warnings.append(
            f"Sensitive data patterns detected: "
            f"{', '.join(detected_types)}"
        )

    # =========================================================
    # 4. Determine security decision
    # =========================================================

    # Credentials / payment secrets = BLOCK
    critical_types = {
        "api_key",
        "authorization_token",
    }

    if (
        sensitive_fields
        or critical_types.intersection(detected_types)
    ):
        status = "blocked"
        passed = False

    # PII such as email = WARNING
    elif detected_types:
        status = "warning"
        passed = True

    # Nothing detected = PASS
    else:
        status = "passed"
        passed = True

    # =========================================================
    # 5. Return security result
    # =========================================================

    return {
        "passed": passed,
        "status": status,
        "sensitive_fields": sensitive_fields,
        "detected_types": detected_types,
        "warnings": warnings,
    }