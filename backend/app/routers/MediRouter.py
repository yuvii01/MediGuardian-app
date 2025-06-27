from fastapi import APIRouter, UploadFile, File, Form, Path
from fastapi.responses import JSONResponse
from app.controllers.medi_controller import MediController
from twilio.rest import Client
import os
import shutil
import pdfminer.high_level
from google.generativeai import GenerativeModel

router = APIRouter(prefix="/api", tags=["medicine"])

medi_controller = MediController()

# Twilio Setup
account_sid = 'AC6cc73cde0f0f70188e18b872f27c852a'
auth_token = 'd9895943a1076b7c89b9b0cb4798f318'
twilio_client = Client(account_sid, auth_token)

# Gemini Setup
import google.generativeai as genai
genai.configure(api_key="AIzaSyAHnKEGncwBBG1RDKjNMr2RVHFH0zMGBqc")
model = genai.GenerativeModel("gemini-1.5-flash")

@router.post("/send-reminder")
async def send_reminder(body: str = Form(...), no: str = Form(...), gno: str = Form(...)):
    try:
        msgs = [
            twilio_client.messages.create(body=body, from_='+17166382994', to=no),
            twilio_client.messages.create(body=body, from_='+17166382994', to=gno),
            twilio_client.calls.create(to=no, from_='+17166382994', twiml='<Response><Say>Ahoy, World!</Say></Response>'),
            twilio_client.calls.create(to=gno, from_='+17166382994', twiml='<Response><Say>Ahoy, World!</Say></Response>')
        ]
        return {"success": True, "message": "Reminders sent successfully"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "message": str(e)})

@router.post("/medi")
async def create_medicine(image: UploadFile = File(...), name: str = Form(...)):
    # Combine form data and file
    data = {"name": name}
    return await medi_controller.create(data, image)

@router.post("/upload-prescription")
async def upload_prescription(file: UploadFile = File(...)):
    try:
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        with open(file_path, 'rb') as f:
            text = pdfminer.high_level.extract_text(f)

        os.remove(file_path)
        return {"success": True, "data": text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "message": str(e)})

@router.get("/{id}")
async def get_medicine(id: str = None):
    return await medi_controller.read(id)

@router.post("/chat_bot/{data}")
async def chat_bot(data: str = Path(...)):
    try:
        result = model.generate_content(data)
        bot_response = result.text
        return {"data": bot_response, "status": 1}
    except:
        return {"data": "some error occurred", "status": 0}

@router.post("/medi_status/{id}")
async def change_status(id: str):
    return await medi_controller.change_status(id)
