from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from app.controllers.user_controller import UserController

router = APIRouter(prefix="/api/user", tags=["user"])
user_controller = UserController()


@router.post("/register")
async def register_user(
    image: UploadFile = File(...),
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    age: str = Form(...),
    phone: str = Form(...),
):
    try:
        body = {
            "name": name,
            "email": email,
            "password": password,
            "age": age,
            "phone": phone
        }
        result = await user_controller.register(body, image)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/login")
async def login_user(
    email: str = Form(...),
    password: str = Form(...)
):
    try:
        body = {
            "email": email,
            "password": password
        }
        result = await user_controller.login(body)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/medi_disease/{id}")
async def user_medi_disease(id: str):
    try:
        result = await user_controller.medi_disease(id)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
