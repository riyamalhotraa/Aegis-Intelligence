import json
from datetime import datetime, timezone
from typing import Any

from database import get_db_connection


def record_security_event(
    event_type: str,
    request_id: str | None,
    result: str,
    details: dict[str, Any] | None = None,
    sensitive_data: dict[str, list[str]] | None = None,
):
    """
    Store a security event permanently in SQLite.

    The database stores the complete security event details.
    The API layer can later mask sensitive values before exposing
    them to the frontend.
    """

    created_at = datetime.now(timezone.utc).isoformat()

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
            json.dumps(details or {}),
            json.dumps(sensitive_data or {}),
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
        "created_at": created_at,
    }


def get_security_events():
    """
    Return all security events from SQLite.
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
            created_at
        FROM security_events
        ORDER BY id DESC
        """
    )

    rows = cursor.fetchall()

    connection.close()

    events = []

    for row in rows:
        events.append({
            "id": f"SEC-{row['id']:05d}",
            "event_type": row["event_type"],
            "request_id": row["request_id"],
            "result": row["result"],
            "details": json.loads(row["details"] or "{}"),
            "created_at": row["created_at"],
        })

    return events


def get_security_stats():
    """
    Calculate security dashboard statistics directly from SQLite.
    """

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT COUNT(*) AS total
        FROM security_events
        """
    )

    total = cursor.fetchone()["total"]

    cursor.execute(
        """
        SELECT COUNT(*) AS count
        FROM security_events
        WHERE result = 'passed'
        """
    )

    passed = cursor.fetchone()["count"]

    cursor.execute(
        """
        SELECT COUNT(*) AS count
        FROM security_events
        WHERE result = 'warning'
        """
    )

    warnings = cursor.fetchone()["count"]

    cursor.execute(
        """
        SELECT COUNT(*) AS count
        FROM security_events
        WHERE result = 'blocked'
        """
    )

    blocked = cursor.fetchone()["count"]

    connection.close()

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
        "audit_coverage": 100 if total > 0 else 0,
    }