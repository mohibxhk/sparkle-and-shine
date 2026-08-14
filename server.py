from fastapi import FastAPI, APIRouter, UploadFile, File, Form, Request, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import time
import uuid
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
from collections import defaultdict

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI(title="Sparkline & Shine API")
api_router = APIRouter(prefix="/api")

ALLOWED_IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHONE_RE = re.compile(r"^[+\d][\d\s\-()]{6,19}$")

_requests = defaultdict(list)

def rate_limit(key: str, limit: int, window: int = 3600):
    now = time.time()
    _requests[key] = [t for t in _requests[key] if now - t < window]
    if len(_requests[key]) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
    _requests[key].append(now)

def clean(value, maxlen=2000):
    return str(value or "").strip()[:maxlen]

def utcnow():
    return datetime.now(timezone.utc).isoformat()


@api_router.get("/")
async def root():
    return {"message": "Sparkline & Shine API"}


@api_router.post("/quotes")
async def create_quote(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    clientType: str = Form(""),
    propertyType: str = Form(""),
    area: str = Form(""),
    rooms: str = Form(""),
    size: str = Form(""),
    cleaningType: str = Form(""),
    frequency: str = Form(""),
    preferredDate: str = Form(""),
    preferredTime: str = Form(""),
    details: str = Form(""),
    website: str = Form(""),
    photo: Optional[UploadFile] = File(None),
):
    rate_limit(f"quote:{request.client.host}", 10)
    if website:
        return {"ok": True}
    name, email, phone = clean(name, 120), clean(email, 200), clean(phone, 40)
    if not name or not EMAIL_RE.match(email) or not PHONE_RE.match(phone):
        raise HTTPException(status_code=422, detail="Please check your name, email and phone number.")

    photo_name = None
    if photo and photo.filename:
        if photo.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=422, detail="Only JPG, PNG or WebP images are allowed.")
        data = await photo.read()
        if len(data) > MAX_FILE_SIZE:
            raise HTTPException(status_code=422, detail="Photo must be smaller than 5MB.")
        photo_name = f"{uuid.uuid4().hex}{ALLOWED_IMAGE_TYPES[photo.content_type]}"
        (UPLOAD_DIR / photo_name).write_bytes(data)

    doc = {
        "id": str(uuid.uuid4()),
        "name": name,
        "email": email,
        "phone": phone,
        "propertyType": clean(propertyType, 120),
        "service": clean(cleaningType, 120),
        "clientType": clean(clientType, 40),
        "location": clean(area, 200),
        "rooms": clean(rooms, 20),
        "size": clean(size, 40),
        "frequency": clean(frequency, 80),
        "preferredDate": clean(preferredDate, 40),
        "preferredTime": clean(preferredTime, 40),
        "message": clean(details),
        "photo": photo_name,
        "source": "quote_form",
        "created_at": utcnow(),
    }
    await db.quotes.insert_one(doc)
    return {"ok": True, "id": doc["id"]}


class LeadIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: str = Field("", max_length=200)
    phone: str = Field("", max_length=40)
    message: str = Field("", max_length=2000)
    source: str = Field("contact", max_length=40)
    propertyType: str = Field("", max_length=120)
    service: str = Field("", max_length=120)
    location: str = Field("", max_length=200)
    preferredDate: str = Field("", max_length=40)
    website: str = Field("", max_length=200)


@api_router.post("/leads")
async def create_lead(body: LeadIn, request: Request):
    rate_limit(f"lead:{request.client.host}", 15)
    if body.website:
        return {"ok": True}
    if body.email and not EMAIL_RE.match(body.email):
        raise HTTPException(status_code=422, detail="Invalid email address.")
    if body.phone and not PHONE_RE.match(body.phone):
        raise HTTPException(status_code=422, detail="Invalid phone number.")
    if not body.email and not body.phone:
        raise HTTPException(status_code=422, detail="Please provide an email or phone number.")
    doc = {
        "id": str(uuid.uuid4()),
        "name": clean(body.name, 120),
        "email": clean(body.email, 200),
        "phone": clean(body.phone, 40),
        "propertyType": clean(body.propertyType, 120),
        "service": clean(body.service, 120),
        "location": clean(body.location, 200),
        "preferredDate": clean(body.preferredDate, 40),
        "message": clean(body.message),
        "source": clean(body.source, 40),
        "created_at": utcnow(),
    }
    await db.leads.insert_one(doc)
    return {"ok": True, "id": doc["id"]}


SYSTEM_PROMPT = """You are the Sparkline & Shine Assistant, the customer-service assistant of Sparkline & Shine Cleaning Service, a professional cleaning company in Lisbon, Portugal.

Verified business facts (use ONLY these):
- Services: residential cleaning, commercial cleaning, and specialty services (deep cleaning and other tailored cleaning solutions).
- Regular cleaning, deep cleaning and specialised services are offered, tailored to each client.
- The company serves homes, apartments, offices, businesses and professional spaces in Lisbon, Portugal.
- The team uses safe, eco-friendly cleaning products and modern techniques.
- Values: quality, reliability, punctuality, attention to detail, customer satisfaction.
- Contact: phone +351 913 118 813, email sparkleshinelimpezas@gmail.com. Located in Lisbon, Portugal.
- Quotes are free and prepared individually; exact pricing is always confirmed by the team.

Rules:
- NEVER invent prices, availability, schedules, guarantees, certifications, years of experience, service areas beyond Lisbon, or extra services.
- If asked something you do not know, say: "I'd be happy to connect you with the Sparkline & Shine team." and share the phone/email.
- Help the visitor choose between residential, commercial and specialty/deep cleaning by asking simple questions about their space.
- Encourage the visitor to request a free quote via the quote form (the "Get a Free Quote" button) or to call +351 913 118 813.
- If the visitor wants a human, provide the phone and email and suggest the contact form.
- Reply in the same language the visitor writes in (English or European Portuguese). Keep answers short (2-4 sentences), warm and professional. No emojis."""


class ChatIn(BaseModel):
    session_id: str = Field(..., min_length=6, max_length=80)
    message: str = Field(..., min_length=1, max_length=1000)


@api_router.post("/chat")
async def chat(body: ChatIn, request: Request):
    rate_limit(f"chat:{request.client.host}", 30)
    history = await db.chat_messages.find(
        {"session_id": body.session_id}, {"_id": 0}
    ).sort("ts", 1).to_list(16)
    transcript = "\n".join(
        f"{'Customer' if m['role'] == 'user' else 'Assistant'}: {m['text']}" for m in history[-8:]
    )
    prompt = f"Conversation so far:\n{transcript}\n\nCustomer: {body.message}" if transcript else body.message
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        assistant = LlmChat(
            api_key=os.environ["EMERGENT_LLM_KEY"],
            session_id=body.session_id,
            system_message=SYSTEM_PROMPT,
        ).with_model("openai", "gpt-5.4-mini")
        reply = await assistant.send_message(UserMessage(text=prompt))
    except Exception as e:
        logging.getLogger(__name__).error("chat error: %s", e)
        reply = ("I'm sorry, I'm having trouble responding right now. "
                 "You can reach the Sparkline & Shine team at +351 913 118 813 "
                 "or sparkleshinelimpezas@gmail.com.")
    await db.chat_messages.insert_many([
        {"session_id": body.session_id, "role": "user", "text": body.message, "ts": utcnow()},
        {"session_id": body.session_id, "role": "assistant", "text": str(reply), "ts": utcnow()},
    ])
    return {"reply": str(reply)}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
