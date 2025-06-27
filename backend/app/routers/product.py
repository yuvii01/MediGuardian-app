from fastapi import APIRouter, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse
from app.controllers.product_controller import ProductController
from typing import Optional

router = APIRouter(prefix="/api/product", tags=["product"])
product_controller = ProductController()


@router.post("/create")
async def create_product(
    image: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category_id: str = Form(...),
):
    try:
        body = {
            "name": name,
            "description": description,
            "price": price,
            "category_id": category_id
        }
        result = await product_controller.create(body, image)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/{id}")
async def get_product_by_id(id: str, skip: int = 0, limit: int = 10):
    try:
        query_params = {"skip": skip, "limit": limit}
        result = await product_controller.read(id, query_params)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/")
async def get_all_products(skip: int = 0, limit: int = 10):
    try:
        result = await product_controller.read(None, {"skip": skip, "limit": limit})
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.delete("/delete/{id}/{image_name}")
async def delete_product(id: str, image_name: str):
    try:
        result = await product_controller.delete(id, image_name)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.patch("/change-status/{id}/{new_status}")
async def change_status(id: str, new_status: str):
    try:
        result = await product_controller.change_status(id, new_status)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.put("/update/{id}")
async def update_product(
    id: str,
    image: Optional[UploadFile] = File(None),
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category_id: str = Form(...),
):
    try:
        body = {
            "name": name,
            "description": description,
            "price": price,
            "category_id": category_id
        }
        result = await product_controller.update(id, body, image)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
