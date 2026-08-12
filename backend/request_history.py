from uuid import uuid4

from blockchain import create_blockchain_record


# ============================================================
# In-memory database
# ============================================================

requests = []


# ============================================================
# Add request
# ============================================================

def add_request(request: dict):
    """
    Store a new request.
    """

    # Generate ID only if one doesn't already exist
    if "id" not in request:
        request["id"] = str(uuid4())

    requests.append(request)

    return request


# ============================================================
# Get all requests
# ============================================================

def get_requests():
    """
    Return all requests.
    """

    return requests


# ============================================================
# Decide human-review request
# ============================================================

def decide_request(request_id: str, decision: str):

    if decision not in ["approved", "rejected"]:
        return None

    for request in requests:

        if request["id"] == request_id:

            # Human made the final decision
            request["decisionBy"] = "User"

            if decision == "approved":
                request["status"] = "approved"

            else:
                request["status"] = "rejected"

            # ------------------------------------------------
            # Write finalized decision to blockchain
            # ------------------------------------------------

            create_blockchain_record(request)

            return request

    return None


# ============================================================
# Generic request update
# ============================================================

def update_request(
    request_id: str,
    status: str,
    decision_by: str
):

    for request in requests:

        if request["id"] == request_id:

            request["status"] = status
            request["decisionBy"] = decision_by

            return request

    return None


# ============================================================
# Dashboard statistics
# ============================================================

def get_dashboard_stats():

    total = len(requests)

    pending = sum(
        1
        for r in requests
        if r["status"] == "pending"
    )

    approved = sum(
        1
        for r in requests
        if r["status"] == "approved"
    )

    rejected = sum(
        1
        for r in requests
        if r["status"] == "rejected"
    )

    spend = sum(
        r["amount"]
        for r in requests
        if r["status"] == "approved"
    )

    return {
        "totalRequests": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "todaySpend": spend,
    }