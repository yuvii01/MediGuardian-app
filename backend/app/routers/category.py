from fastapi import APIRouter, UploadFile, File, Form, Path
from typing import Optional
from app.controllers.category_controller import CategoryController

router = APIRouter(prefix="/category", tags=["category"])
controller = CategoryController()

@router.post("/create")
async def create_category(
    name: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...)
):
    return await controller.create({"name": name, "description": description}, image)

@router.get("/{id}")
async def get_category(id: str = Path(...)):
    return await controller.read(id)

@router.get("/")
async def get_all_categories():
    return await controller.read(None)

@router.delete("/delete/{id}/{image_name}")
async def delete_category(id: str, image_name: str):
    return await controller.delete(id, image_name)

@router.patch("/change-status/{id}/{new_status}")
async def change_status(id: str, new_status: str):
    return await controller.change_status(id, new_status)

@router.put("/update/{id}")
async def update_category(
    id: str,
    name: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    return await controller.update(id, {"name": name, "description": description}, image)
