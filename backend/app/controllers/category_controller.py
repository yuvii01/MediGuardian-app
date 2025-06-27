import os
from fastapi import UploadFile
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["your_database_name"]
category_collection = db["categories"]

IMAGE_DIR = "./static/images/category/"

async def save_image(image: UploadFile):
    ext = image.filename.split('.')[-1]
    image_name = f"{int(datetime.now().timestamp())}_{image.filename}"
    path = os.path.join(IMAGE_DIR, image_name)
    with open(path, "wb") as buffer:
        buffer.write(await image.read())
    return image_name

async def create_category(data: dict, image: UploadFile):
    image_name = await save_image(image)
    data["image"] = image_name
    result = await category_collection.insert_one(data)
    return {"msg": "Category added", "status": 1, "id": str(result.inserted_id)}

async def read_category(category_id: str = None):
    if category_id:
        category = await category_collection.find_one({"_id": ObjectId(category_id)})
        return category
    else:
        return await category_collection.find().to_list(100)

async def delete_category(category_id: str, image_name: str):
    await category_collection.delete_one({"_id": ObjectId(category_id)})
    path = os.path.join(IMAGE_DIR, image_name)
    if os.path.exists(path):
        os.remove(path)
    return {"msg": "Category deleted", "status": 1}

async def update_category(category_id: str, data: dict, image: UploadFile = None):
    update_data = { "name": data["name"], "slug": data["slug"] }

    if image:
        new_image_name = await save_image(image)
        update_data["image"] = new_image_name
        old = await category_collection.find_one({"_id": ObjectId(category_id)})
        if old and "image" in old:
            old_path = os.path.join(IMAGE_DIR, old["image"])
            if os.path.exists(old_path):
                os.remove(old_path)

    await category_collection.update_one({"_id": ObjectId(category_id)}, {"$set": update_data})
    return {"msg": "Category updated", "status": 1}

async def change_status(category_id: str, status: bool):
    await category_collection.update_one({"_id": ObjectId(category_id)}, {"$set": {"status": status}})
    return {"msg": "Status changed", "status": 1}
