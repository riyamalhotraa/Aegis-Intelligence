from typing import Dict, List



# ============================================================
# ACTIVE AEGIS POLICY CONFIGURATION
# ============================================================

policy_config = {
    "allowed_providers": [
        "Bloomberg",
        "NewsAPI",
        "Skyscanner",
        "OpenWeather",
        "Gmail",
    ],

    "auto_approve_limit": 100,

    "human_review_limit": 1000,

    "daily_budget": 5000,
    

    "frequency_limit": 2,

    "guardrails_enabled": {
    "provider_allow_list": True,
    "auto_approval_limit": True,
    "human_review_limit": True,
    "daily_budget": True,
    "frequency_limit": True,
},
}

today_request_count = 0


# ============================================================
# GET CURRENT CONFIGURATION
# ============================================================

def get_policy_config():
    return policy_config


# ============================================================
# PROVIDER POLICY
# ============================================================

def add_provider(provider: str):

    if provider not in policy_config["allowed_providers"]:
        policy_config["allowed_providers"].append(provider)

    return policy_config


def remove_provider(provider: str):

    if provider in policy_config["allowed_providers"]:
        policy_config["allowed_providers"].remove(provider)

    return policy_config


# ============================================================
# SPENDING POLICY
# ============================================================

def update_auto_approve_limit(limit: float):

    policy_config["auto_approve_limit"] = limit

    return policy_config


def update_human_review_limit(limit: float):

    policy_config["human_review_limit"] = limit

    return policy_config


def update_daily_budget(limit: float):

    policy_config["daily_budget"] = limit

    return policy_config


# ============================================================
# APPLY AI SUGGESTION
# ============================================================

def apply_policy_suggestion(suggestion: dict):

    suggestion_type = suggestion.get("suggestion_type")
    suggested_value = suggestion.get("suggested_value")

    if not suggested_value:
        raise ValueError("Suggestion does not contain a value.")

    # --------------------------------------------------------
    # Provider allow list
    # --------------------------------------------------------

    if suggestion_type == "provider_allowlist":

        provider = suggested_value.strip()

        if provider in policy_config["allowed_providers"]:
            return {
                "success": True,
                "message": f"{provider} is already on the allow list.",
                "config": policy_config,
            }

        add_provider(provider)

        return {
            "success": True,
            "message": f"{provider} added to provider allow list.",
            "config": policy_config,
        }

    # --------------------------------------------------------
    # Autonomous spending limit
    # --------------------------------------------------------

    if suggestion_type == "spending_limit":

        value = float(
            suggested_value.replace("$", "").replace(",", "")
        )

        update_auto_approve_limit(value)

        return {
            "success": True,
            "message": f"Autonomous approval limit updated to ${value:,.0f}.",
            "config": policy_config,
        }

    # --------------------------------------------------------
    # Daily budget
    # --------------------------------------------------------

    if suggestion_type == "daily_budget":

        value = float(
            suggested_value.replace("$", "").replace(",", "")
        )

        update_daily_budget(value)

        return {
            "success": True,
            "message": f"Daily budget updated to ${value:,.0f}.",
            "config": policy_config,
        }

    # --------------------------------------------------------
    # Frequency limit
    # --------------------------------------------------------

    if suggestion_type == "frequency_limit":

        value = int(
            suggested_value.replace(",", "")
        )

        policy_config["frequency_limit"] = value

        return {
            "success": True,
            "message": f"Frequency limit updated to {value} requests.",
            "config": policy_config,
        }

    raise ValueError(
        f"Unsupported policy suggestion type: {suggestion_type}"
    )

def toggle_guardrail(
    guardrail_id: str,
    enabled: bool
):
    if guardrail_id not in policy_config["guardrails_enabled"]:
        raise ValueError(
            f"Unknown guardrail: {guardrail_id}"
        )

    policy_config["guardrails_enabled"][guardrail_id] = enabled

    return policy_config

def check_frequency():
    config = get_policy_config()

    if not config["guardrails_enabled"]["frequency_limit"]:
        return (
            True,
            "Request frequency guardrail is disabled."
        )

    frequency_limit = config["frequency_limit"]

    global today_request_count

    if today_request_count >= frequency_limit:
        return (
            False,
            "Daily request frequency limit exceeded."
        )

    today_request_count += 1

    return (
        True,
        "Request frequency within allowed limit."
    )

def reset_frequency_counter():
    global today_request_count

    today_request_count = 0

    return {
        "success": True,
        "message": "Frequency counter reset.",
        "count": today_request_count,
    }