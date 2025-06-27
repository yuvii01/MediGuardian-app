from fastapi import APIRouter, Request, Body
from app.controllers.cart_controller import CartController
from pydantic import BaseModel

router = APIRouter(prefix="/cart", tags=["cart"])
controller = CartController()

class CartItem(BaseModel):
    user_id: str
    prod_id: str

class AddCartData(BaseModel):
    user_id: str
    items: list

class ChangeQtyData(BaseModel):
    user_id: str
    prod_id: str
    quantity: int

@router.post("/state-to-cart/{user_id}")
async def state_to_cart(user_id: str, request: Request):
    body = await request.json()
    return await controller.state_to_cart(user_id, body)

@router.put("/change-quantity")
async def change_quantity(data: ChangeQtyData):
    return await controller.change_qty(data.dict())

@router.post("/add-to-cart")
async def add_to_cart(data: AddCartData):
    return await controller.add_to_cart(data.dict())

@router.delete("/remove-from-cart")
async def remove_from_cart(data: CartItem):
    return await controller.remove_from_cart(data.user_id, data.prod_id)
