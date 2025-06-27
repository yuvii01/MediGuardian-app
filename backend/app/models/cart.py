from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime

# Utility to support ObjectId in Pydantic
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

# Schema for reading from DB
class CartModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    pId: PyObjectId
    qty: int = 1
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda x: x.isoformat()}

# Schema for creating a cart item
class CartCreateModel(BaseModel):
    user_id: PyObjectId
    pId: PyObjectId
    qty: Optional[int] = 1
