from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
from app.controllers.order_controller import OrderController

router = APIRouter(prefix="/api/order", tags=["orders"])
order_controller = OrderController()

@router.post("/place-order")
async def place_order(payload: dict = Body(...)):
    try:
        result = await order_controller.place_order(payload)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/payment-success")
async def payment_success(payload: dict = Body(...)):
    try:
        result = await order_controller.payment_success(payload)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/payment-failed")
async def payment_failed(payload: dict = Body(...)):
    try:
        result = await order_controller.payment_failed(payload)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/{id}")
async def thankyou_order(id: str):
    try:
        result = await order_controller.thankyou_order(id)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/")
async def get_all_orders():
    try:
        result = await order_controller.thankyou_order(None)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
