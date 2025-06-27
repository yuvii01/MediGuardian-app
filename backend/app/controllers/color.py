from models.color import Color  # Assuming MongoEngine model
from mongoengine import DoesNotExist

class ColorController:

    def create(self, data):
        try:
            color = Color(name=data.get("name"), code=data.get("color"))
            color.save()
            return {
                "msg": "Color added",
                "status": 1
            }
        except Exception as e:
            return {
                "msg": "Unable to add color",
                "status": 0,
                "error": str(e)
            }

    def read(self, color_id=None):
        try:
            if color_id:
                color = Color.objects.get(id=color_id)
                colors = [color.to_json()]
            else:
                colors = [c.to_json() for c in Color.objects.all()]
            return {
                "msg": "Color(s) found",
                "colors": colors,
                "status": 1
            }
        except DoesNotExist:
            return {
                "msg": "Color not found",
                "status": 0
            }
        except Exception as e:
            return {
                "msg": "Internal server error",
                "status": 0,
                "error": str(e)
            }

    def delete(self, color_id):
        try:
            result = Color.objects(id=color_id).delete()
            if result:
                return {
                    "msg": "Data deleted",
                    "status": 1
                }
            return {
                "msg": "Color not found",
                "status": 0
            }
        except Exception as e:
            return {
                "msg": "Unable to delete",
                "status": 0,
                "error": str(e)
            }

    def change_status(self, color_id, new_status):
        try:
            updated = Color.objects(id=color_id).update_one(set__status=new_status)
            if updated:
                return {
                    "msg": "Status changed",
                    "status": 1
                }
            return {
                "msg": "Color not found",
                "status": 0
            }
        except Exception as e:
            return {
                "msg": "Unable to change status",
                "status": 0,
                "error": str(e)
            }

    def update(self, color_id, data):
        try:
            updated = Color.objects(id=color_id).update_one(
                set__name=data.get("name"),
                set__code=data.get("code")
            )
            if updated:
                return {
                    "msg": "Data updated",
                    "status": 1
                }
            return {
                "msg": "Color not found",
                "status": 0
            }
        except Exception as e:
            return {
                "msg": "Unable to update data",
                "status": 0,
                "error": str(e)
            }
