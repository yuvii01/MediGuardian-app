from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime


# ObjectId validator
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError(f"Invalid ObjectId: {v}")
        return ObjectId(v)


# Main order model (read from DB)
class OrderModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    shipping_details: Dict[str, Any]
    product_details: List[Dict[str, Any]]
    order_total: float
    payment_mode: int  # 1 = UPI, 2 = Cash, etc.
    order_status: int = 1  # 1=pending, 2=processing, 3=shipped, etc.
    transaction_id: Optional[PyObjectId]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat() if v else None
        }


# Order creation model (input from user)
class OrderCreateModel(BaseModel):
    user_id: str
    shipping_details: Dict[str, Any]
    product_details: List[Dict[str, Any]]
    order_total: float
    payment_mode: int
    order_status: Optional[int] = 1
    transaction_id: Optional[str]

    class Config:
        json_encoders = {
            ObjectId: str
        }
