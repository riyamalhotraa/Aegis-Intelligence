from datetime import datetime, timezone
from typing import Any


security_events: list[dict[str, Any]] = []


def record_security_event(
    event_type: str,
    request_id: str | None,
    result: str,
    details: dict[str, Any] | None = None,
):
    event = {
        "id": f"SEC-{len(security_events) + 1:05d}",
        "event_type": event_type,
        "request_id": request_id,
        "result": result,
        "details": details or {},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    security_events.append(event)

    return event


def get_security_events():
    return security_events


def get_security_stats():
    total = len(security_events)

    passed = sum(
        1 for event in security_events
        if event["result"] == "passed"
    )

    warnings = sum(
        1 for event in security_events
        if event["result"] == "warning"
    )

    blocked = sum(
        1 for event in security_events
        if event["result"] == "blocked"
    )

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