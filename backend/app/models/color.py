from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime

# Custom ObjectId validator
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

# Full schema for reading from DB
class ColorModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    code: str
    status: bool = True
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat() if dt else None
        }

# Schema for creating a new color
class ColorCreateModel(BaseModel):
    name: str
    code: str
    status: Optional[bool] = True
