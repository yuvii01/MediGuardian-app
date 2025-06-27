import razorpay
import hashlib
import hmac
from models.order import Order
from models.cart import Cart
from models.transaction import Transaction
from bson.objectid import ObjectId

# Razorpay credentials
RAZORPAY_KEY_ID = 'rzp_test_vNoztmT3ky59rZ'
RAZORPAY_KEY_SECRET = 'gKe4sYCv34witrbNBPRh7FY5'

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


class OrderController:

    def generate_signature(self, order_id, payment_id, secret):
        message = f"{order_id}|{payment_id}"
        return hmac.new(
            key=bytes(secret, 'utf-8'),
            msg=bytes(message, 'utf-8'),
            digestmod=hashlib.sha256
        ).hexdigest()

    def verify_signature(self, order_id, payment_id, received_signature, secret=RAZORPAY_KEY_SECRET):
        expected_signature = self.generate_signature(order_id, payment_id, secret)
        return expected_signature == received_signature

    def place_order(self, data):
        try:
            order = Order(
                user_id=data.get("user_id"),
                shipping_details=data.get("shipping_details"),
                order_total=data.get("order_total"),
                payment_mode=data.get("payment_mode"),
                product_details=data.get("product_details")
            )
            order.save()

            if order.payment_mode == 2:
                options = {
                    'amount': int(order.order_total * 100),
                    'currency': 'INR',
                    'receipt': str(order.id)
                }
                razor_order = razorpay_client.order.create(options)
                Cart.objects(user_id=order.user_id).delete()

                return {
                    "order_id": str(order.id),
                    "msg": "Your Order Placed online",
                    "razor_order": razor_order,
                    "status": 1
                }
            else:
                Cart.objects(user_id=order.user_id).delete()
                return {
                    "order_id": str(order.id),
                    "msg": "Your Order Placed through offline",
                    "status": 1
                }
        except Exception as e:
            print(e)
            return {
                "msg": "Internal server error",
                "status": 0
            }

    def payment_success(self, order_id, razorpay_response):
        try:
            verified = self.verify_signature(
                razorpay_response["razorpay_order_id"],
                razorpay_response["razorpay_payment_id"],
                razorpay_response["razorpay_signature"]
            )

            if not verified:
                return {"msg": "Farzi Payment", "status": 0}

            order = Order.objects.get(id=ObjectId(order_id))
            transaction = Transaction(
                orderId=order.id,
                userId=order.user_id,
                amount=order.order_total,
                type=order.payment_mode,
                payment_status=1,
                razorpayResponse=razorpay_response
            )
            transaction.save()

            order.update(set__transaction_id=transaction.id, set__order_status=2)

            return {
                "msg": "Order placed through online",
                "status": 1,
                "order_id": str(order.id)
            }
        except Exception as e:
            print(e)
            return {"msg": "Internal server error", "status": 0}

    def payment_failed(self, order_id, razorpay_response):
        try:
            order = Order.objects.get(id=ObjectId(order_id))
            transaction = Transaction(
                orderId=order.id,
                userId=order.user_id,
                amount=order.order_total,
                type=order.payment_mode,
                payment_status=0,
                razorpayResponse=razorpay_response
            )
            transaction.save()

            return {
                "msg": "Order Payment Failed",
                "status": 0,
                "order_id": str(order.id)
            }
        except Exception as e:
            print(e)
            return {"msg": "Internal server error", "status": 0}

    def thankyou_order(self, order_id):
        try:
            order = Order.objects.get(id=ObjectId(order_id))
            return {
                "msg": "Order found",
                "order": order.to_json(),
                "status": 1
            }
        except Exception as e:
            return {"msg": "Internal server error", "status": 0, "error": str(e)}
