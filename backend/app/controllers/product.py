import os
import json
import time
import random
from werkzeug.utils import secure_filename
from models.product import Product
from models.category import Category
from models.color import Color
from bson.objectid import ObjectId


class ProductController:

    def create(self, data, image):
        try:
            image_name = f"{int(time.time())}{random.randint(0, 1900)}{secure_filename(image.filename)}"
            destination = os.path.join("public/image/product", image_name)
            image.save(destination)

            product = Product(
                name=data.get("name"),
                slug=data.get("slug"),
                price=float(data.get("price")),
                discount_percent=float(data.get("discount_percent")),
                discount_price=float(data.get("discount_price")),
                image=image_name,
                category_id=ObjectId(data.get("category")),
                color=json.loads(data.get("color"))
            )
            product.save()
            return {"msg": "Product Added", "status": 1}

        except Exception as e:
            print(e)
            return {"msg": "Internal server error", "status": 0}

    def read(self, id=None, query=None):
        try:
            db_query = {}

            if query.get("category_slug"):
                category = Category.objects(slug=query["category_slug"]).first()
                if category:
                    db_query["category_id"] = category.id

            if query.get("color_id") and query["color_id"] != "null":
                db_query["color"] = ObjectId(query["color_id"])

            if id:
                product = Product.objects(id=ObjectId(id)).first()
                if not product:
                    return {"msg": "Product not found", "status": 0}
                product = [product]
            else:
                limit = int(query.get("limit", 0))
                product = Product.objects(**db_query).limit(limit) if limit else Product.objects(**db_query)

            return {
                "msg": "Product found",
                "product": [p.to_json() for p in product],
                "status": 1,
                "imageBaseUrl": "/image/product/"
            }

        except Exception as e:
            print(e)
            return {"msg": "Internal server error", "status": 0}

    def delete(self, id, image_name):
        try:
            Product.objects(id=ObjectId(id)).delete()
            image_path = os.path.join("public/image/product", image_name)
            if os.path.exists(image_path):
                os.remove(image_path)
            return {"msg": "Data deleted", "status": 1}
        except Exception as e:
            print(e)
            return {"msg": "Unable to delete", "status": 0}

    def update(self, id, data, image=None):
        try:
            update_data = {
                "name": data.get("name"),
                "slug": data.get("slug"),
                "price": float(data.get("price")),
                "discount_percent": float(data.get("discount_percent")),
                "discount_price": float(data.get("discount_price")),
                "category_id": ObjectId(data.get("category")),
                "color": json.loads(data.get("color"))
            }

            if image:
                image_name = f"{int(time.time())}{random.randint(0, 1900)}{secure_filename(image.filename)}"
                destination = os.path.join("public/image/product", image_name)
                image.save(destination)

                old_product = Product.objects(id=ObjectId(id)).first()
                if old_product and old_product.image:
                    old_path = os.path.join("public/image/product", old_product.image)
                    if os.path.exists(old_path):
                        os.remove(old_path)

                update_data["image"] = image_name

            Product.objects(id=ObjectId(id)).update_one(**{"set__" + k: v for k, v in update_data.items()})

            return {"msg": "Data updated", "status": 1}

        except Exception as e:
            print(e)
            return {"msg": "Unable to update data", "status": 0}

    def change_status(self, id, new_status):
        try:
            Product.objects(id=ObjectId(id)).update_one(set__status=new_status)
            return {"msg": "Status Changed", "status": 1}
        except Exception as e:
            print(e)
            return {"msg": "Unable to Change Status", "status": 0}
