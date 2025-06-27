from fastapi import APIRouter, Path
from pydantic import BaseModel
from typing import Optional
from app.controllers.color_controller import ColorController

router = APIRouter(prefix="/color", tags=["color"])
controller = ColorController()

# Request model
class ColorData(BaseModel):
    name: str
    code: Optional[str] = None
    status: Optional[str] = "active"

@router.post("/create")
async def create_color(data: ColorData):
    return await controller.create(data.dict())

@router.get("/{id}")
async def get_color(id: str = Path(...)):
    return await controller.read(id)

@router.get("/")
async def get_all_colors():
    return await controller.read(None)

@router.patch("/change-status/{id}/{new_status}")
async def change_status(id: str, new_status: str):
    return await controller.change_status(id, new_status)

@router.delete("/delete/{id}")
async def delete_color(id: str):
    return await controller.delete(id)

@router.put("/update/{id}")
async def update_color(id: str, data: ColorData):
    return await controller.update(id, data.dict())
