"""
ALG Tech Hub - Backend FastAPI com MySQL
Versão adaptada do MongoDB para MySQL
"""

from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import Error
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import re
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MySQL connection configuration
MYSQL_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'database': os.getenv('MYSQL_DATABASE', 'alg_tech_hub'),
    'user': os.getenv('MYSQL_USER', 'alg_app'),
    'password': os.getenv('MYSQL_PASSWORD', 'senha_segura'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci',
    'autocommit': True
}

# Create connection pool
from mysql.connector import pooling

mysql_pool = pooling.MySQLConnectionPool(
    pool_name="alg_pool",
    pool_size=5,
    pool_reset_session=True,
    **MYSQL_CONFIG
)

# Create the main app
app = FastAPI(title="ALG Tech Hub API", version="2.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure apropriadamente em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db_connection():
    """Get database connection from pool"""
    try:
        connection = mysql_pool.get_connection()
        return connection
    except Error as e:
        logging.error(f"Error getting database connection: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# Models (mantendo os mesmos do MongoDB)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactForm(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="new")
    source: str = Field(default="website")

class ContactFormCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)

class BudgetRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: str = Field(..., min_length=2, max_length=100)
    company_size: str = Field(..., pattern=r'^(1-10|11-50|51-200|201-500|500\+)$')
    services: List[str] = Field(..., min_items=1)
    budget_range: str = Field(..., pattern=r'^(under-5k|5k-15k|15k-30k|30k-50k|50k\+|custom)$')
    timeline: str = Field(..., pattern=r'^(immediate|1-month|3-months|6-months|flexible)$')
    description: str = Field(..., min_length=20, max_length=2000)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")
    priority: str = Field(default="medium")

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

class NewsletterSubscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: Optional[str] = Field(None, max_length=100)
    interests: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="active")
    source: str = Field(default="website")

class NewsletterSubscriptionCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = Field(None, max_length=100)
    interests: List[str] = Field(default_factory=list)

# Database operations
class DatabaseOperations:
    
    @staticmethod
    def create_status_check(connection, status_check: StatusCheck):
        """Create a new status check"""
        cursor = connection.cursor()
        try:
            query = """
            INSERT INTO status_checks (id, client_name, timestamp)
            VALUES (%s, %s, %s)
            """
            cursor.execute(query, (
                status_check.id,
                status_check.client_name,
                status_check.timestamp
            ))
            connection.commit()
            return status_check
        except Error as e:
            logging.error(f"Error creating status check: {e}")
            raise HTTPException(status_code=500, detail="Database error")
        finally:
            cursor.close()
    
    @staticmethod
    def get_status_checks(connection, limit: int = 100):
        """Get status checks"""
        cursor = connection.cursor(dictionary=True)
        try:
            query = "SELECT * FROM status_checks ORDER BY timestamp DESC LIMIT %s"
            cursor.execute(query, (limit,))
            return cursor.fetchall()
        except Error as e:
            logging.error(f"Error getting status checks: {e}")
            raise HTTPException(status_code=500, detail="Database error")
        finally:
            cursor.close()
    
    @staticmethod
    def create_contact_form(connection, contact: ContactForm, ip_address: str = None, user_agent: str = None):
        """Create a new contact form"""
        cursor = connection.cursor()
        try:
            query = """
            INSERT INTO contact_forms 
            (id, name, email, phone, company, subject, message, timestamp, status, source, ip_address, user_agent)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (
                contact.id,
                contact.name,
                contact.email,
                contact.phone,
                contact.company,
                contact.subject,
                contact.message,
                contact.timestamp,
                contact.status,
                contact.source,
                ip_address,
                user_agent
            ))
            connection.commit()
            return contact
        except Error as e:
            logging.error(f"Error creating contact form: {e}")
            raise HTTPException(status_code=500, detail="Database error")
        finally:
            cursor.close()
    
    @staticmethod
    def get_contact_forms(connection, limit: int = 100):
        """Get contact forms"""
        cursor = connection.cursor(dictionary=True)
        try:
            query = "SELECT * FROM contact_forms ORDER BY timestamp DESC LIMIT %s"
            cursor.execute(query, (limit,))
            return cursor.fetchall()
        except Error as e:
            logging.error(f"Error getting contact forms: {e}")
            raise HTTPException(status_code=500, detail="Database error")
        finally:
            cursor.close()
    
    @staticmethod
    def create_budget_request(connection, budget: BudgetRequest):
        """Create a new budget request"""
        cursor = connection.cursor()
        try:
            # Insert budget request
            query = """
            INSERT INTO budget_requests 
            (id, name, email, phone, company, company_size, budget_range, timeline, description, timestamp, status, priority)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (
                budget.id,
                budget.name,
                budget.email,
                budget.phone,
                budget.company,
                budget.company_size,
                budget.budget_range,
                budget.timeline,
                budget.description,
                budget.timestamp,
                budget.status,
                budget.priority
            ))
            
            # Insert services
            for service in budget.services:
                service_query = """
                INSERT INTO budget_services (budget_request_id, service_name)
                VALUES (%s, %s)
                """
                cursor.execute(service_query, (budget.id, service))
            
            connection.commit()
            return budget
        except Error as e:
            logging.error(f"Error creating budget request: {e}")
            raise HTTPException(status_code=500, detail="Database error")
        finally:
            cursor.close()
    
    @staticmethod
    def create_newsletter_subscription(connection, newsletter: NewsletterSubscription):
        """Create a new newsletter subscription"""
        cursor = connection.cursor()
        try:
            # Insert subscription
            query = """
            INSERT INTO newsletter_subscriptions (id, email, name, timestamp, status, source)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            status = VALUES(status),
            updated_at = CURRENT_TIMESTAMP
            """
            cursor.execute(query, (
                newsletter.id,
                newsletter.email,
                newsletter.name,
                newsletter.timestamp,
                newsletter.status,
                newsletter.source
            ))
            
            # Insert interests
            if newsletter.interests:
                # Delete existing interests
                cursor.execute("DELETE FROM newsletter_interests WHERE subscription_id = %s", (newsletter.id,))
                
                # Insert new interests
                for interest in newsletter.interests:
                    interest_query = """
                    INSERT INTO newsletter_interests (subscription_id, interest)
                    VALUES (%s, %s)
                    """
                    cursor.execute(interest_query, (newsletter.id, interest))
            
            connection.commit()
            return newsletter
        except Error as e:
            logging.error(f"Error creating newsletter subscription: {e}")
            raise HTTPException(status_code=500, detail="Database error")
        finally:
            cursor.close()

# API Routes
@api_router.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "ALG Tech Hub API",
        "version": "2.0.0",
        "database": "mysql",
        "status": "online",
        "timestamp": datetime.utcnow().isoformat()
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(status_data: StatusCheckCreate):
    """Create a new status check"""
    connection = get_db_connection()
    try:
        status_check = StatusCheck(client_name=status_data.client_name)
        result = DatabaseOperations.create_status_check(connection, status_check)
        return result
    finally:
        connection.close()

@api_router.get("/status")
async def get_status_checks(limit: int = 100):
    """Get status checks"""
    connection = get_db_connection()
    try:
        results = DatabaseOperations.get_status_checks(connection, limit)
        return {"status_checks": results}
    finally:
        connection.close()

@api_router.post("/contact", response_model=ContactForm)
async def create_contact(contact_data: ContactFormCreate, background_tasks: BackgroundTasks):
    """Create a new contact form submission"""
    connection = get_db_connection()
    try:
        contact = ContactForm(**contact_data.dict())
        result = DatabaseOperations.create_contact_form(connection, contact)
        
        # Send email in background
        background_tasks.add_task(send_contact_email, contact)
        
        return result
    finally:
        connection.close()

@api_router.get("/contact")
async def get_contacts(limit: int = 100):
    """Get contact forms"""
    connection = get_db_connection()
    try:
        results = DatabaseOperations.get_contact_forms(connection, limit)
        return {"contacts": results}
    finally:
        connection.close()

@api_router.post("/budget", response_model=BudgetRequest)
async def create_budget_request(budget_data: BudgetRequestCreate, background_tasks: BackgroundTasks):
    """Create a new budget request"""
    connection = get_db_connection()
    try:
        budget = BudgetRequest(**budget_data.dict())
        result = DatabaseOperations.create_budget_request(connection, budget)
        
        # Send email in background
        background_tasks.add_task(send_budget_email, budget)
        
        return result
    finally:
        connection.close()

@api_router.post("/newsletter", response_model=NewsletterSubscription)
async def create_newsletter_subscription(newsletter_data: NewsletterSubscriptionCreate):
    """Create a new newsletter subscription"""
    connection = get_db_connection()
    try:
        newsletter = NewsletterSubscription(**newsletter_data.dict())
        result = DatabaseOperations.create_newsletter_subscription(connection, newsletter)
        return result
    finally:
        connection.close()

# Email functions (mantidas do original)
async def send_contact_email(contact: ContactForm):
    """Send contact form email"""
    try:
        smtp_server = os.getenv('SMTP_SERVER', 'mail.algti.com.br')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        email_user = os.getenv('EMAIL_USER', 'contato@algti.com.br')
        email_pass = os.getenv('EMAIL_PASS', 'sua_senha')
        
        msg = MIMEMultipart()
        msg['From'] = email_user
        msg['To'] = email_user
        msg['Subject'] = f"Contato do Site: {contact.subject}"
        
        body = f"""
        Nova mensagem do site ALG Tech Hub:
        
        Nome: {contact.name}
        Email: {contact.email}
        Telefone: {contact.phone or 'Não informado'}
        Empresa: {contact.company or 'Não informado'}
        Assunto: {contact.subject}
        
        Mensagem:
        {contact.message}
        
        Enviado em: {contact.timestamp.strftime('%d/%m/%Y às %H:%M')}
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(email_user, email_pass)
        server.send_message(msg)
        server.quit()
        
    except Exception as e:
        logging.error(f"Error sending contact email: {e}")

async def send_budget_email(budget: BudgetRequest):
    """Send budget request email"""
    try:
        smtp_server = os.getenv('SMTP_SERVER', 'mail.algti.com.br')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        email_user = os.getenv('EMAIL_USER', 'contato@algti.com.br')
        email_pass = os.getenv('EMAIL_PASS', 'sua_senha')
        
        msg = MIMEMultipart()
        msg['From'] = email_user
        msg['To'] = email_user
        msg['Subject'] = f"Solicitação de Orçamento: {budget.company}"
        
        services_list = ', '.join(budget.services)
        
        body = f"""
        Nova solicitação de orçamento:
        
        Nome: {budget.name}
        Email: {budget.email}
        Telefone: {budget.phone or 'Não informado'}
        Empresa: {budget.company}
        Tamanho da Empresa: {budget.company_size}
        Serviços: {services_list}
        Orçamento: {budget.budget_range}
        Prazo: {budget.timeline}
        
        Descrição:
        {budget.description}
        
        Enviado em: {budget.timestamp.strftime('%d/%m/%Y às %H:%M')}
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(email_user, email_pass)
        server.send_message(msg)
        server.quit()
        
    except Exception as e:
        logging.error(f"Error sending budget email: {e}")

# Include router
app.include_router(api_router)

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        connection.close()
        
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
