from pydantic import BaseModel
from typing import Optional


class PaymentRequirements(BaseModel):
    amount: float
    currency: str = "USDC"
    network: str = "Base Sepolia"
    pay_to: str
    description: str


class PaymentRequest(BaseModel):
    request_id: str
    task: str
    provider: str
    api: str
    amount: float
    currency: str = "USDC"


class PaymentAuthorization(BaseModel):
    request_id: str
    payment_signature: str


class PaymentResponse(BaseModel):
    payment_id: str
    request_id: str
    status: str
    amount: float
    currency: str
    network: str
    transaction_hash: Optional[str] = None
    message: str