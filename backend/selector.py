import json

from guardrails import evaluate_payment
from request_history import add_request
from blockchain import create_blockchain_record
from x402.payment_service import create_payment_request

# ============================================================
# Load API catalog and keyword mapping
# ============================================================

with open("api_catalog.json", "r", encoding="utf-8") as f:
    apis = json.load(f)

with open("keyword_map.json", "r", encoding="utf-8") as f:
    keywords = json.load(f)


# ============================================================
# Select API + evaluate payment
# ============================================================

def select_api(user_prompt: str):

    user_prompt = user_prompt.lower()

    # --------------------------------------------------------
    # Find matching categories
    # --------------------------------------------------------

    matched_categories = []

    for category, details in keywords.items():

        for keyword in details["keywords"]:

            if keyword in user_prompt:

                matched_categories.append({
                    "category": category,
                    "priority": details["priority"]
                })

                break

    # --------------------------------------------------------
    # No category found
    # --------------------------------------------------------

    if not matched_categories:

        return {
            "success": False,
            "error": "Could not determine the task category."
        }

    # --------------------------------------------------------
    # Select highest-priority category
    # --------------------------------------------------------

    matched_categories.sort(
        key=lambda x: x["priority"],
        reverse=True
    )

    selected_category = matched_categories[0]["category"]

    # --------------------------------------------------------
    # Select API
    # --------------------------------------------------------

    selected_api = apis[selected_category][0]

    # --------------------------------------------------------
    # Run AEGIS guardrails
    # --------------------------------------------------------

    guardrail_result = evaluate_payment(
        selected_api["provider"],
        selected_api["cost"]
    )

    decision = guardrail_result["decision"]

    # --------------------------------------------------------
    # Determine initial status
    # --------------------------------------------------------

    if decision == "human_review":

        status = "pending"
        decision_by = "Guardrails"

    elif decision == "approved":

        status = "approved"
        decision_by = "Guardrails"

    else:

        status = "rejected"
        decision_by = "Guardrails"

    # --------------------------------------------------------
    # Create payment request
    # --------------------------------------------------------

    payment_request = {

        "task": user_prompt,

        "provider": selected_api["provider"],

        "api": selected_api["name"],

        "amount": selected_api["cost"],

        "category": selected_category,

        # Guardrail decision
        "decision": decision,

        # Risk information
        "riskLevel": guardrail_result["riskLevel"],

        # Explanation
        "reason": guardrail_result["reason"],

        # Individual policy checks
        "checks": guardrail_result["checks"],

        # Current lifecycle status
        "status": status,

        # Who made the current decision
        "decisionBy": decision_by,
    }

    # --------------------------------------------------------
    # Save request to AEGIS request history
    #
    # add_request() generates the request ID.
    # --------------------------------------------------------

    saved_request = add_request(payment_request)
    print("🔥 SELECTOR REACHED BLOCKCHAIN CHECK")
    print("DECISION:", decision)
    print("SAVED REQUEST:", saved_request)
    # --------------------------------------------------------
    # Blockchain audit
    #
    # Only FINAL decisions are recorded immediately.
    #
    # approved  → blockchain
    # blocked   → blockchain
    # human_review → wait for user
    # --------------------------------------------------------

    if decision in ["approved", "blocked"]:

        print("🔥 CALLING BLOCKCHAIN")

        create_blockchain_record(
            saved_request
        )


    # ------------------------------------------------------------
    # Automatically create a transaction for approved requests
    # ------------------------------------------------------------

    if decision == "approved":

        print("💳 CREATING PAYMENT")
        print(
            "REQUEST ID:",
            saved_request["id"]
        )

        payment = create_payment_request(
            request_id=saved_request["id"],
            task=saved_request["task"],
            provider=saved_request["provider"],
            api=saved_request["api"],
            amount=float(
                saved_request["amount"]
            ),
        )

        print(
            "💳 PAYMENT CREATED:",
            payment["payment_id"]
        )

        print(
            "🔗 TRANSACTION CREATED:",
            payment["transaction_id"]
        )

    # --------------------------------------------------------
    # Return saved request
    # --------------------------------------------------------

    return saved_request