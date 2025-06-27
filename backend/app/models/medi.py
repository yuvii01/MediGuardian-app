from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime

# Utility to validate ObjectId fields
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

# Main schema used for reading from the DB
class MediModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    Med_id: Optional[PyObjectId]
    user_id: Optional[PyObjectId]
    name: str
    qty: int = 1
    date: datetime
    timing: str
    description: Optional[str] = None
    image: str
    isTrue: bool = False
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat() if v else None
        }

# Schema for creating a new record
class MediCreateModel(BaseModel):
    Med_id: Optional[str]
    user_id: Optional[str]
    name: str
    qty: Optional[int] = 1
    date: datetime
    timing: str
    description: Optional[str]
    image: str
    isTrue: Optional[bool] = False
