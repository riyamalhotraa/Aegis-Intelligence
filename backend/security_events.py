import json
from datetime import datetime, timezone
from typing import Any

from database import get_db_connection


# ============================================================
# MASKING HELPERS
# ============================================================

def mask_email(email: str) -> str:
    """
    Show the first 3 characters of the email
    and keep the domain visible.

    Example:
        riya@example.com
        -> riy***@example.com
    """

    if not email:
        return email

    if "@" not in email:
        return "***"

    local, domain = email.split("@", 1)

    if len(local) <= 3:
        masked_local = local[0] + "***"
    else:
        masked_local = local[:3] + "***"

    return f"{masked_local}@{domain}"


def mask_phone(phone: str) -> str:
    """
    Show only the last 4 digits.

    Example:
        +91 9876543210
        -> *******3210
    """

    if not phone:
        return phone

    digits = "".join(
        character
        for character in phone
        if character.isdigit()
    )

    if len(digits) <= 4:
        return "*" * len(digits)

    return "*" * 7 + digits[-4:]


def mask_username(username: str) -> str:
    """
    Show the first 3 characters.

    Example:
        riya_malhotra
        -> riy**********
    """

    if not username:
        return username

    if len(username) <= 3:
        return username[0] + "***"

    return username[:3] + "*" * (len(username) - 3)


def mask_sensitive_data(
    sensitive_data: dict[str, Any] | None,
) -> dict[str, list[str]]:
    """
    Convert stored full PII into safe values for API/frontend use.

    IMPORTANT:
    The database keeps the original values.
    Only the values returned by get_security_events()
    are masked.
    """

    sensitive_data = sensitive_data or {}

    masked = {
        "email": [],
        "phone": [],
        "username": [],
    }

    # --------------------------------------------------------
    # Email
    # --------------------------------------------------------

    for email in sensitive_data.get("email", []):

        if isinstance(email, str):
            masked["email"].append(
                mask_email(email)
            )

    # --------------------------------------------------------
    # Phone
    # --------------------------------------------------------

    for phone in sensitive_data.get("phone", []):

        if isinstance(phone, str):
            masked["phone"].append(
                mask_phone(phone)
            )

    # --------------------------------------------------------
    # Username
    # --------------------------------------------------------

    for username in sensitive_data.get("username", []):

        if isinstance(username, str):
            masked["username"].append(
                mask_username(username)
            )

    return masked


# ============================================================
# RECORD SECURITY EVENT
# ============================================================

def record_security_event(
    event_type: str,
    request_id: str | None,
    result: str,
    details: dict[str, Any] | None = None,
    sensitive_data: dict[str, list[str]] | None = None,
):
    """
    Store a security event in SQLite.

    Full PII values are stored in SQLite.

    They are NOT returned directly to the frontend.
    get_security_events() masks them before API exposure.
    """

    created_at = datetime.now(
        timezone.utc
    ).isoformat()

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO security_events (
            event_type,
            request_id,
            result,
            details,
            sensitive_data,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            event_type,
            request_id,
            result,
            json.dumps(
                details or {}
            ),
            json.dumps(
                sensitive_data or {
                    "email": [],
                    "phone": [],
                    "username": [],
                }
            ),
            created_at,
        ),
    )

    event_id = cursor.lastrowid

    connection.commit()
    connection.close()

    return {
        "id": f"SEC-{event_id:05d}",

        "event_type": event_type,

        "request_id": request_id,

        "result": result,

        "details": details or {},

        # This is the internal result of recording.
        # Do NOT use this directly for the public API.
        "sensitive_data": sensitive_data or {
            "email": [],
            "phone": [],
            "username": [],
        },

        "created_at": created_at,
    }


# ============================================================
# GET SECURITY EVENTS
# ============================================================

def get_security_events():
    """
    Read security events from SQLite.

    SQLite contains the FULL sensitive values.

    Before returning events to the API/frontend,
    sensitive values are MASKED.
    """

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            id,
            event_type,
            request_id,
            result,
            details,
            sensitive_data,
            created_at
        FROM security_events
        ORDER BY id DESC
        """
    )

    rows = cursor.fetchall()

    connection.close()

    events = []

    for row in rows:

        # ----------------------------------------------------
        # Parse details
        # ----------------------------------------------------

        try:
            details = json.loads(
                row["details"] or "{}"
            )

        except (
            json.JSONDecodeError,
            TypeError,
        ):
            details = {}

        # ----------------------------------------------------
        # Parse FULL sensitive data from SQLite
        # ----------------------------------------------------

        try:
            stored_sensitive_data = json.loads(
                row["sensitive_data"] or "{}"
            )

        except (
            json.JSONDecodeError,
            TypeError,
        ):
            stored_sensitive_data = {}

        # ----------------------------------------------------
        # MASK BEFORE RETURNING TO FRONTEND
        # ----------------------------------------------------

        masked_sensitive_data = mask_sensitive_data(
            stored_sensitive_data
        )

        # ----------------------------------------------------
        # Build public event
        # ----------------------------------------------------

        events.append(
            {
                "id": f"SEC-{row['id']:05d}",

                "event_type":
                    row["event_type"],

                "request_id":
                    row["request_id"],

                "result":
                    row["result"],

                "details":
                    details,

                "sensitive_data":
                    masked_sensitive_data,

                "created_at":
                    row["created_at"],
            }
        )

    return events


# ============================================================
# SECURITY STATISTICS
# ============================================================

def get_security_stats():
    """
    Calculate security dashboard statistics
    directly from SQLite.
    """

    connection = get_db_connection()
    cursor = connection.cursor()

    # --------------------------------------------------------
    # Total
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT COUNT(*) AS total
        FROM security_events
        """
    )

    total = cursor.fetchone()["total"]

    # --------------------------------------------------------
    # Passed
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT COUNT(*) AS count
        FROM security_events
        WHERE result = 'passed'
        """
    )

    passed = cursor.fetchone()["count"]

    # --------------------------------------------------------
    # Warnings
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT COUNT(*) AS count
        FROM security_events
        WHERE result = 'warning'
        """
    )

    warnings = cursor.fetchone()["count"]

    # --------------------------------------------------------
    # Blocked
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT COUNT(*) AS count
        FROM security_events
        WHERE result = 'blocked'
        """
    )

    blocked = cursor.fetchone()["count"]

    connection.close()

    # --------------------------------------------------------
    # Overall status
    # --------------------------------------------------------

    if blocked > 0:

        status = "critical"

    elif warnings > 0:

        status = "attention_required"

    else:

        status = "healthy"

    return {
        "status": status,

        "total_checks": total,

        "passed": passed,

        "warnings": warnings,

        "blocked": blocked,

        "audit_coverage":
            100 if total > 0 else 0,
    }