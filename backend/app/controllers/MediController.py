import os
import time
import random
from flask import current_app
from models.medi import Medi
from mongoengine import DoesNotExist

class MediController:

    def create(self, data, image_file):
        try:
            # Generate a unique image name
            timestamp = int(time.time())
            random_num = random.randint(0, 1900)
            image_name = f"{timestamp}_{random_num}_{image_file.filename}"
            upload_path = os.path.join(current_app.root_path, "static/image/medi", image_name)

            # Save the uploaded image
            image_file.save(upload_path)

            # Create new Medi entry
            medi = Medi(
                user_id=data.get("user_id"),
                name=data.get("name"),
                qty=data.get("qty", 1),
                description=data.get("description"),
                date=data.get("date"),
                timing=data.get("timing"),
                image=image_name
            )
            medi.save()

            return {
                "msg": "Medicine Added",
                "status": 1
            }
        except Exception as e:
            return {
                "msg": "Unable to upload or save data",
                "status": 0,
                "error": str(e)
            }

    def read(self, medi_id=None):
        try:
            if medi_id:
                medicine = Medi.objects.get(id=medi_id)
                data = medicine.to_json()
            else:
                data = [m.to_json() for m in Medi.objects.all()]
            return {
                "msg": "Data found",
                "medicine": data,
                "status": 1
            }
        except DoesNotExist:
            return {
                "msg": "Medicine not found",
                "status": 0
            }
        except Exception as e:
            return {
                "msg": "Internal server error",
                "status": 0,
                "error": str(e)
            }

    def change_status(self, medi_id):
        try:
            medicine = Medi.objects.get(id=medi_id)
            medicine.isTrue = True
            medicine.save()
            return {
                "msg": "Medicine Status Updated",
                "status": 1
            }
        except DoesNotExist:
            return {
                "msg": "Medicine not found",
                "status": 0
            }
        except Exception as e:
            return {
                "msg": "Unable to edit Medicine",
                "status": 0,
                "error": str(e)
            }
