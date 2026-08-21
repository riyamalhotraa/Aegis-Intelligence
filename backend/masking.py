import re


def mask_email(email: str) -> str:
    if "@" not in email:
        return "***"

    local, domain = email.split("@", 1)

    if len(local) <= 3:
        masked_local = local + "***"
    else:
        masked_local = local[:3] + "***"

    return f"{masked_local}@{domain}"


def mask_username(username: str) -> str:
    if len(username) <= 3:
        return "***"

    return username[:3] + "*" * (len(username) - 3)


def mask_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)

    if len(digits) <= 4:
        return "****"

    return "*" * (len(digits) - 4) + digits[-4:]


def mask_sensitive_data(
    sensitive_data: dict[str, list[str]]
) -> dict[str, list[str]]:

    return {
        "email": [
            mask_email(value)
            for value in sensitive_data.get("email", [])
        ],

        "phone": [
            mask_phone(value)
            for value in sensitive_data.get("phone", [])
        ],

        "username": [
            mask_username(value)
            for value in sensitive_data.get("username", [])
        ],
    }