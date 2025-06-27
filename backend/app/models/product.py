from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime


# Validator for MongoDB ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError(f"Invalid ObjectId: {v}")
        return ObjectId(v)


# Product model for reading from the database
class ProductModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    slug: str
    price: float
    discount_percent: Optional[float] = 0
    discount_price: Optional[float] = None
    image: Optional[str] = None
    category_id: Optional[PyObjectId]
    status: Optional[bool] = True
    color: Optional[List[PyObjectId]] = []
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat() if v else None
        }


# Product model for creation (input)
class ProductCreateModel(BaseModel):
    name: str
    slug: str
    price: float
    discount_percent: Optional[float] = 0
    discount_price: Optional[float] = None
    image: Optional[str] = None
    category_id: Optional[str] = None
    status: Optional[bool] = True
    color: Optional[List[str]] = []

    class Config:
        json_encoders = {
            ObjectId: str
        }
