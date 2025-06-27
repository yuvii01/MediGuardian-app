from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime


# Custom validator for ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value):
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)


# Main Transaction Model (for reading)
class TransactionModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    orderId: PyObjectId
    userId: PyObjectId
    amount: float
    type: int  # enum: -1 or 2
    payment_status: bool = False
    razorpayResponse: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat() if v else None
        }


# Transaction Create Schema (for POST request input)
class TransactionCreateModel(BaseModel):
    orderId: str
    userId: str
    amount: float
    type: int  # must be -1 or 2
    razorpayResponse: Optional[Dict[str, Any]] = None

    class Config:
        json_encoders = {
            ObjectId: str
        }
