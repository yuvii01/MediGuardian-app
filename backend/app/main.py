from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import motor.motor_asyncio
from app.routers import category, product, user, cart, order, medi

app = FastAPI()

# CORS Middleware (like app.use(cors()))
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving (like express.static("public"))
app.mount("/public", StaticFiles(directory="app/public"), name="public")

# Routers (like app.use(...))
app.include_router(category.router, prefix="/category")
app.include_router(product.router, prefix="/product")
app.include_router(user.router, prefix="/user")
app.include_router(cart.router, prefix="/cart")
app.include_router(order.router, prefix="/order")
app.include_router(medi.router, prefix="/api")

# MongoDB Connection
@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
    app.mongodb = app.mongodb_client["med"]
    print("Connected to MongoDB!")

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()
