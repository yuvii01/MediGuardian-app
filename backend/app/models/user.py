from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
from datetime import datetime


# Custom validator for MongoDB ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value):
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)


# User model for reading from the DB
class UserModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    password: str
    Image: str
    contactNumber: Optional[str] = None
    email: EmailStr
    gender: Optional[str] = Field(default=None, pattern="^(Male|Female|Other)?$")
    status: bool = True
    address: str
    age: int
    guardian_contactNo: str
    Disease: Optional[str] = None
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat() if v else None
        }


# Model for creating a new user
class UserCreateModel(BaseModel):
    name: str
    password: str
    Image: str
    contactNumber: Optional[str] = None
    email: EmailStr
    gender: Optional[str] = Field(default=None, pattern="^(Male|Female|Other)?$")
    address: str
    age: int
    guardian_contactNo: str
    Disease: Optional[str] = None

    class Config:
        json_encoders = {
            ObjectId: str
        }


# Optional: Public user model (without sensitive fields like password)
class PublicUserModel(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: str
    email: EmailStr
    Image: str
    gender: Optional[str]
    contactNumber: Optional[str]
    age: int
    Disease: Optional[str]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }
