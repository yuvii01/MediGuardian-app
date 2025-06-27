from flask import jsonify
from app.models import cart as Cart
from mongoengine.queryset.visitor import Q

class CartController:

    def change_qty(self, user_id, pId, new_qty):
        if new_qty <= 0:
            return {"msg": "Invalid quantity", "status": 0}
        try:
            updated = Cart.objects(user_id=user_id, pId=pId).update_one(set__qty=new_qty)
            if updated:
                return {"msg": "QTY Changed", "status": 1}
            return {"msg": "Cart item not found", "status": 0}
        except Exception as e:
            return {"msg": "Internal server error", "status": 0, "error": str(e)}

    def state_to_cart(self, user_id, state_cart):
        try:
            for sc in state_cart:
                pId = sc["pId"]
                qty = sc["qty"]
                existing = Cart.objects(user_id=user_id, pId=pId).first()
                if existing:
                    existing.qty += qty
                    existing.save()
                else:
                    Cart(user_id=user_id, pId=pId, qty=qty).save()
            user_cart = Cart.objects(user_id=user_id).select_related()
            return {"msg": "success", "status": 1, "userCart": [c.to_json() for c in user_cart]}
        except Exception as e:
            return {"msg": "Internal server error", "status": 0, "error": str(e)}

    def add_to_cart(self, user_id, pId):
        try:
            cart_item = Cart.objects(user_id=user_id, pId=pId).first()
            if cart_item:
                cart_item.qty += 1
                cart_item.save()
            else:
                Cart(user_id=user_id, pId=pId, qty=1).save()

            user_cart = Cart.objects(user_id=user_id).select_related()
            return {"msg": "Added to Cart", "status": 1, "userCart": [c.to_json() for c in user_cart]}
        except Exception as e:
            return {"msg": "Unable to add to Cart", "status": 0, "error": str(e)}

    def remove_from_cart(self, user_id, pId):
        try:
            result = Cart.objects(user_id=user_id, pId=pId).delete()
            if result:
                return {"msg": "Deleted product", "status": 1}
            return {"msg": "Product not found", "status": 0}
        except Exception as e:
            return {"msg": "Internal server error", "status": 0, "error": str(e)}

    def get_cart(self, user_id):
        try:
            cart_items = Cart.objects(user_id=user_id).select_related()
            return {"status": 1, "cart": [item.to_json() for item in cart_items]}
        except Exception as e:
            return {"status": 0, "msg": "Error fetching cart", "error": str(e)}

    def clear_cart(self, user_id):
        try:
            Cart.objects(user_id=user_id).delete()
            return {"status": 1, "msg": "Cart cleared"}
        except Exception as e:
            return {"status": 0, "msg": "Failed to clear cart", "error": str(e)}
