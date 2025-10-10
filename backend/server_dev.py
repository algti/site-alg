"""
ALG Tech Hub - Servidor de Desenvolvimento
Versão que funciona sem MySQL para testes locais
"""

from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env.dev')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the main app
app = FastAPI(title="ALG Tech Hub API - DEV", version="2.0.0-dev")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ContactFormCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)

class BudgetRequestCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: str = Field(..., min_length=2, max_length=100)
    company_size: str = Field(..., pattern=r'^(1-10|11-50|51-200|201-500|500\+)$')
    services: List[str] = Field(..., min_items=1)
    budget_range: str = Field(..., pattern=r'^(under-5k|5k-15k|15k-30k|30k-50k|50k\+|custom)$')
    timeline: str = Field(..., pattern=r'^(immediate|1-month|3-months|6-months|flexible)$')
    description: str = Field(..., min_length=20, max_length=2000)

class NewsletterSubscriptionCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = Field(None, max_length=100)
    interests: List[str] = Field(default_factory=list)

# In-memory storage for development
dev_storage = {
    "contacts": [],
    "budgets": [],
    "newsletters": []
}

# API Routes
@api_router.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "ALG Tech Hub API - Development Mode",
        "version": "2.0.0-dev",
        "status": "online",
        "database": "in-memory (development)",
        "timestamp": datetime.utcnow().isoformat()
    }

@api_router.post("/contact")
async def create_contact(contact_data: ContactFormCreate, background_tasks: BackgroundTasks):
    """Create a new contact form submission"""
    try:
        contact = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "status": "new",
            "source": "website",
            **contact_data.dict()
        }
        
        # Store in memory
        dev_storage["contacts"].append(contact)
        
        # Send email in background
        background_tasks.add_task(send_contact_email, contact)
        
        logger.info(f"✅ Contact saved: {contact['name']} ({contact['email']})")
        
        return {
            "success": True,
            "message": "Mensagem enviada com sucesso!",
            "contact_id": contact["id"],
            "timestamp": contact["timestamp"]
        }
        
    except Exception as e:
        logger.error(f"Error creating contact: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/contact")
async def get_contacts(limit: int = 100):
    """Get contact forms"""
    try:
        contacts = dev_storage["contacts"][-limit:] if limit else dev_storage["contacts"]
        return {"contacts": contacts}
    except Exception as e:
        logger.error(f"Error getting contacts: {str(e)}")
        return {"contacts": []}

@api_router.post("/budget")
async def create_budget_request(budget_data: BudgetRequestCreate, background_tasks: BackgroundTasks):
    """Create a new budget request"""
    try:
        budget = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "status": "pending",
            "priority": "medium",
            **budget_data.dict()
        }
        
        # Store in memory
        dev_storage["budgets"].append(budget)
        
        # Send email in background
        background_tasks.add_task(send_budget_email, budget)
        
        logger.info(f"✅ Budget request saved: {budget['company']}")
        
        return budget
        
    except Exception as e:
        logger.error(f"Error creating budget request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/newsletter")
async def create_newsletter_subscription(newsletter_data: NewsletterSubscriptionCreate):
    """Create a new newsletter subscription"""
    try:
        newsletter = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "status": "active",
            "source": "website",
            **newsletter_data.dict()
        }
        
        # Check if email already exists
        existing = next((n for n in dev_storage["newsletters"] if n["email"] == newsletter["email"]), None)
        if existing:
            existing.update(newsletter)
            logger.info(f"✅ Newsletter updated: {newsletter['email']}")
        else:
            dev_storage["newsletters"].append(newsletter)
            logger.info(f"✅ Newsletter subscription: {newsletter['email']}")
        
        return newsletter
        
    except Exception as e:
        logger.error(f"Error creating newsletter subscription: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/status")
async def get_status():
    """Get API status"""
    return {
        "status": "online",
        "contacts_count": len(dev_storage["contacts"]),
        "budgets_count": len(dev_storage["budgets"]),
        "newsletters_count": len(dev_storage["newsletters"])
    }

# Email functions
async def send_contact_email(contact):
    """Send contact form email"""
    try:
        logger.info(f"📧 Enviando email de contato: {contact['name']}")
        # Simular envio de email em desenvolvimento
        print(f"""
        📧 EMAIL SIMULADO - CONTATO
        ===========================
        De: {contact['name']} ({contact['email']})
        Assunto: {contact['subject']}
        Empresa: {contact.get('company', 'N/A')}
        Telefone: {contact.get('phone', 'N/A')}
        
        Mensagem:
        {contact['message']}
        ===========================
        """)
        
    except Exception as e:
        logger.error(f"Error sending contact email: {e}")

async def send_budget_email(budget):
    """Send budget request email"""
    try:
        logger.info(f"📧 Enviando email de orçamento: {budget['company']}")
        # Simular envio de email em desenvolvimento
        services_list = ', '.join(budget['services'])
        print(f"""
        📧 EMAIL SIMULADO - ORÇAMENTO
        =============================
        De: {budget['name']} ({budget['email']})
        Empresa: {budget['company']}
        Tamanho: {budget['company_size']}
        Serviços: {services_list}
        Orçamento: {budget['budget_range']}
        Prazo: {budget['timeline']}
        
        Descrição:
        {budget['description']}
        =============================
        """)
        
    except Exception as e:
        logger.error(f"Error sending budget email: {e}")

# Include router
app.include_router(api_router)

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "in-memory",
        "mode": "development",
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando servidor de desenvolvimento...")
    print("📝 Modo: SEM MySQL (dados em memória)")
    print("📧 Emails: Simulados no console")
    print("🌐 URL: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
