import os
import time
import random
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename

from models.user import User
from helper import encrypt_password, decrypt_password


class UserController:

    def register(self, data, image):
        try:
            if User.objects(email=data.get("email")).first():
                return {"msg": "Email already used", "status": 0}

            image_name = f"{int(time.time())}{random.randint(0, 1900)}{secure_filename(image.filename)}"
            destination = os.path.join("public/image/profile", image_name)
            image.save(destination)

            user = User(
                name=data.get("name"),
                email=data.get("email"),
                password=encrypt_password(data.get("password")),
                image=image_name,
                age=int(data.get("age")),
                contactNumber=data.get("contactNumber"),
                guardian_contactNo=data.get("guardian_contactNo"),
                disease=data.get("disease"),
                address=data.get("address")
            )
            user.save()

            return {"msg": "New user added", "status": 1, "user": user.to_json()}

        except Exception as e:
            print("Registration error:", e)
            return {"msg": "Internal server error", "status": 0}

    def login(self, data):
        try:
            user = User.objects(email=data.get("email")).first()
            if user:
                if decrypt_password(user.password) == data.get("password"):
                    return {"msg": "Login successful", "status": 1, "user": user.to_json()}
                else:
                    return {"msg": "Incorrect password", "status": 0}
            else:
                return {"msg": "This email does not exist", "status": 0}
        except Exception as e:
            print("Login error:", e)
            return {"msg": "Internal server error", "status": 0}

    def medi_disease(self, user_id):
        try:
            user = User.objects(id=ObjectId(user_id)).first()
            if user:
                return {"msg": "User found", "status": 1, "disease": user.disease}
            else:
                return {"msg": "User not found", "status": 0}
        except Exception as e:
            print("Disease fetch error:", e)
            return {"msg": "Internal server error", "status": 0}
