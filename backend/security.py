import re
from typing import Any


# ============================================================
# SENSITIVE FIELD NAMES
# ============================================================

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


# ============================================================
# SENSITIVE VALUE PATTERNS
# ============================================================

# Email
EMAIL_PATTERN = re.compile(
    r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b",
    re.IGNORECASE,
)


# API keys
API_KEY_PATTERN = re.compile(
    r"""
    (?:
        \bsk_live_[A-Za-z0-9_-]{8,}\b
        |
        \bsk_test_[A-Za-z0-9_-]{8,}\b
        |
        \bAKIA[A-Za-z0-9]{8,}\b
        |
        \bAIza[A-Za-z0-9_-]{20,}\b
        |
        \bghp_[A-Za-z0-9]{20,}\b
        |
        \bgithub_pat_[A-Za-z0-9_]{20,}\b
        |
        \bxox[baprs]-[A-Za-z0-9-]{10,}\b
    )
    """,
    re.IGNORECASE | re.VERBOSE,
)


# Bearer / authorization tokens
BEARER_PATTERN = re.compile(
    r"""
    \bBearer
    \s+
    [A-Za-z0-9\-._~+/]+=*
    """,
    re.IGNORECASE | re.VERBOSE,
)


# Phone numbers
PHONE_PATTERN = re.compile(
    r"""
    (?<![A-Za-z0-9])
    (?:
        \+?\d[\d\s().-]{8,}\d
    )
    (?![A-Za-z0-9])
    """,
    re.VERBOSE,
)


# Explicit username declarations
#
# Matches:
# username: riya_malhotra
# username=riya_malhotra
# user name: riya_malhotra
USERNAME_PATTERN = re.compile(
    r"\b(?:username|user\s+name)\s*[:=]\s*([A-Za-z0-9_.-]+)",
    re.IGNORECASE,
)


# ============================================================
# SECURITY INSPECTION
# ============================================================

def inspect_payment_request(
    data: dict[str, Any],
) -> dict[str, Any]:
    """
    Inspect payment/task metadata before it enters the
    AEGIS guardrail and payment flow.

    Returns:

        passed:
            Whether the request can continue.

        status:
            passed / warning / blocked

        sensitive_fields:
            Sensitive field names detected in the request.

        detected_types:
            Types of sensitive information detected.

        warnings:
            Human-readable security findings.

        sensitive_data:
            Actual detected PII values that may be stored
            securely in SQLite and masked before public display.

            Credentials such as API keys and authorization
            tokens are intentionally NOT stored here.
    """

    sensitive_fields: list[str] = []

    detected_types: list[str] = []

    warnings: list[str] = []

    # --------------------------------------------------------
    # Detected PII values
    # --------------------------------------------------------

    sensitive_data: dict[str, list[str]] = {
        "email": [],
        "phone": [],
        "username": [],
    }

    # ========================================================
    # 1. Sensitive field-name detection
    # ========================================================

    for key in data.keys():

        normalized = key.lower().replace("-", "_")

        if normalized in SENSITIVE_FIELD_NAMES:

            sensitive_fields.append(key)

    # ========================================================
    # 2. Inspect string values
    # ========================================================

    for key, value in data.items():

        if not isinstance(value, str):
            continue

        # ----------------------------------------------------
        # Email
        # ----------------------------------------------------

        email_matches = EMAIL_PATTERN.findall(value)

        for email in email_matches:

            if email not in sensitive_data["email"]:

                sensitive_data["email"].append(email)

        if (
            email_matches
            and "email" not in detected_types
        ):
            detected_types.append("email")

        # ----------------------------------------------------
        # API key
        # ----------------------------------------------------

        if API_KEY_PATTERN.search(value):

            if "api_key" not in detected_types:

                detected_types.append("api_key")

        # ----------------------------------------------------
        # Bearer token
        # ----------------------------------------------------

        if BEARER_PATTERN.search(value):

            if "authorization_token" not in detected_types:

                detected_types.append(
                    "authorization_token"
                )

        # ----------------------------------------------------
        # Phone
        # ----------------------------------------------------

        phone_matches = PHONE_PATTERN.findall(value)

        for phone in phone_matches:

            if phone not in sensitive_data["phone"]:

                sensitive_data["phone"].append(phone)

        if (
            phone_matches
            and "phone" not in detected_types
        ):
            detected_types.append("phone")

        # ----------------------------------------------------
        # Username
        # ----------------------------------------------------

        username_matches = USERNAME_PATTERN.findall(value)

        username_matches = [
            username.rstrip(".,!?;:")
            for username in username_matches
        ]

        for username in username_matches:

            if username not in sensitive_data["username"]:

                sensitive_data["username"].append(
                    username
                )

        if (
            username_matches
            and "username" not in detected_types
        ):
            detected_types.append("username")

    # ========================================================
    # 3. Generate security findings
    # ========================================================

    if sensitive_fields:

        warnings.append(
            "Sensitive fields detected: "
            + ", ".join(sensitive_fields)
        )

    if detected_types:

        warnings.append(
            "Sensitive data patterns detected: "
            + ", ".join(detected_types)
        )

    # ========================================================
    # 4. Determine security decision
    # ========================================================

    # Credentials / payment secrets = BLOCK

    critical_types = {
        "api_key",
        "authorization_token",
    }

    if (
        sensitive_fields
        or critical_types.intersection(
            detected_types
        )
    ):

        status = "blocked"

        passed = False

    # --------------------------------------------------------
    # PII = WARNING
    # --------------------------------------------------------

    elif detected_types:

        status = "warning"

        passed = True

    # --------------------------------------------------------
    # Nothing detected = PASS
    # --------------------------------------------------------

    else:

        status = "passed"

        passed = True

    # ========================================================
    # 5. Return security result
    # ========================================================

    return {
        "passed": passed,

        "status": status,

        "sensitive_fields": sensitive_fields,

        "detected_types": detected_types,

        "warnings": warnings,

        "sensitive_data": sensitive_data,
    }