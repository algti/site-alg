"""
ALG Tech Hub - Backend FastAPI com MySQL
"""

from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Depends, Header, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from mysql.connector import Error, pooling
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from collections import defaultdict, deque
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import json
import time
import uuid
import secrets
import logging
import smtplib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(level=os.getenv('LOG_LEVEL', 'INFO'))
logger = logging.getLogger("alg")


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Variável de ambiente obrigatória não definida: {name}")
    return value


MYSQL_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'database': os.getenv('MYSQL_DATABASE', 'alg_tech_hub'),
    'user': os.getenv('MYSQL_USER', 'alg_app'),
    'password': require_env('MYSQL_PASSWORD'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci',
    'autocommit': True
}

SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
EMAIL_USER = require_env('EMAIL_USER')
EMAIL_PASS = require_env('EMAIL_PASS')
COMPANY_EMAIL = os.getenv('COMPANY_EMAIL', EMAIL_USER)
ADMIN_TOKEN = os.getenv('ADMIN_TOKEN')
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

RATE_LIMIT_MAX = int(os.getenv('RATE_LIMIT_MAX', '5'))
RATE_LIMIT_WINDOW = int(os.getenv('RATE_LIMIT_WINDOW', '600'))

DEFAULT_ORIGINS = ["https://algti.com.br", "https://algti.com", "http://localhost:5173"]


def parse_origins(raw: Optional[str]) -> List[str]:
    if not raw:
        return DEFAULT_ORIGINS
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return [str(o).strip() for o in parsed if str(o).strip()]
    except ValueError:
        pass
    return [o.strip() for o in raw.split(',') if o.strip()]


mysql_pool = pooling.MySQLConnectionPool(
    pool_name="alg_pool",
    pool_size=5,
    pool_reset_session=True,
    **MYSQL_CONFIG
)

app = FastAPI(
    title="ALG Tech Hub API",
    version="3.0.0",
    docs_url="/docs" if DEBUG else None,
    redoc_url=None,
    openapi_url="/openapi.json" if DEBUG else None,
)

api_router = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_origins(os.getenv('CORS_ORIGINS')),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-Admin-Token"],
)


# ---------------------------------------------------------------------------
# Proteções: rate limit, honeypot e autenticação administrativa
# ---------------------------------------------------------------------------
_hits = defaultdict(deque)


def client_ip(request: Request) -> str:
    forwarded = request.headers.get('x-forwarded-for')
    if forwarded:
        return forwarded.split(',')[-1].strip()
    return request.client.host if request.client else 'unknown'


def rate_limit(request: Request):
    key = f"{client_ip(request)}:{request.url.path}"
    now = time.monotonic()
    hits = _hits[key]
    while hits and now - hits[0] > RATE_LIMIT_WINDOW:
        hits.popleft()
    if len(hits) >= RATE_LIMIT_MAX:
        raise HTTPException(status_code=429, detail="Muitas solicitações. Tente novamente em alguns minutos.")
    hits.append(now)
    if len(_hits) > 10000:
        for k in [k for k, v in _hits.items() if not v or now - v[-1] > RATE_LIMIT_WINDOW]:
            del _hits[k]


def require_admin(x_admin_token: Optional[str] = Header(None)):
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=503, detail="Acesso administrativo desabilitado")
    if not x_admin_token or not secrets.compare_digest(x_admin_token, ADMIN_TOKEN):
        raise HTTPException(status_code=401, detail="Não autorizado")


def get_db_connection():
    try:
        return mysql_pool.get_connection()
    except Error as e:
        logger.error(f"Error getting database connection: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")


# ---------------------------------------------------------------------------
# Modelos
# ---------------------------------------------------------------------------
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
    website: Optional[str] = Field(None, max_length=200)  # honeypot


class BudgetRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: str = Field(..., min_length=2, max_length=100)
    company_size: str = Field(..., pattern=r'^(1-10|11-50|51-200|201-500|500\+)$')
    services: List[str] = Field(..., min_length=1)
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
    services: List[str] = Field(..., min_length=1)
    budget_range: str = Field(..., pattern=r'^(under-5k|5k-15k|15k-30k|30k-50k|50k\+|custom)$')
    timeline: str = Field(..., pattern=r'^(immediate|1-month|3-months|6-months|flexible)$')
    description: str = Field(..., min_length=20, max_length=2000)
    website: Optional[str] = Field(None, max_length=200)  # honeypot


# ---------------------------------------------------------------------------
# Banco de dados
# ---------------------------------------------------------------------------
class DatabaseOperations:

    @staticmethod
    def create_contact_form(connection, contact: ContactForm, ip_address: str = None, user_agent: str = None):
        cursor = connection.cursor()
        try:
            cursor.execute(
                """
                INSERT INTO contact_forms
                (id, name, email, phone, company, subject, message, timestamp, status, source, ip_address, user_agent)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (contact.id, contact.name, contact.email, contact.phone, contact.company,
                 contact.subject, contact.message, contact.timestamp, contact.status,
                 contact.source, ip_address, (user_agent or '')[:500])
            )
            connection.commit()
            return contact
        except Error as e:
            logger.error(f"Error creating contact form: {e}")
            raise HTTPException(status_code=500, detail="Database error")
        finally:
            cursor.close()

    @staticmethod
    def get_contact_forms(connection, limit: int = 100):
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM contact_forms ORDER BY timestamp DESC LIMIT %s", (limit,))
            return cursor.fetchall()
        except Error as e:
            logger.error(f"Error getting contact forms: {e}")
            raise HTTPException(status_code=500, detail="Database error")
        finally:
            cursor.close()

    @staticmethod
    def create_budget_request(connection, budget: BudgetRequest):
        cursor = connection.cursor()
        try:
            cursor.execute(
                """
                INSERT INTO budget_requests
                (id, name, email, phone, company, company_size, budget_range, timeline, description, timestamp, status, priority)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (budget.id, budget.name, budget.email, budget.phone, budget.company,
                 budget.company_size, budget.budget_range, budget.timeline, budget.description,
                 budget.timestamp, budget.status, budget.priority)
            )
            for service in budget.services:
                cursor.execute(
                    "INSERT INTO budget_services (budget_request_id, service_name) VALUES (%s, %s)",
                    (budget.id, service)
                )
            connection.commit()
            return budget
        except Error as e:
            logger.error(f"Error creating budget request: {e}")
            raise HTTPException(status_code=500, detail="Database error")
        finally:
            cursor.close()


# ---------------------------------------------------------------------------
# E-mail (executado em threadpool, sem bloquear o event loop)
# ---------------------------------------------------------------------------
def send_email(subject: str, body: str, reply_to: Optional[str] = None):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = COMPANY_EMAIL
        msg['Subject'] = subject
        if reply_to:
            msg['Reply-To'] = reply_to
        msg.attach(MIMEText(body, 'plain', 'utf-8'))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=20) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
    except Exception:
        logger.exception(f"FALHA AO ENVIAR E-MAIL ({subject}) - o lead permanece salvo no banco")


def send_contact_email(contact: ContactForm):
    body = f"""Nova mensagem do site ALG:

Nome: {contact.name}
Email: {contact.email}
Telefone: {contact.phone or 'Não informado'}
Empresa: {contact.company or 'Não informado'}
Assunto: {contact.subject}

Mensagem:
{contact.message}

Enviado em: {contact.timestamp.strftime('%d/%m/%Y às %H:%M')} (UTC)
"""
    send_email(f"Contato do Site: {contact.subject}", body, reply_to=contact.email)


def send_budget_email(budget: BudgetRequest):
    body = f"""Nova solicitação de orçamento:

Nome: {budget.name}
Email: {budget.email}
Telefone: {budget.phone or 'Não informado'}
Empresa: {budget.company}
Tamanho da Empresa: {budget.company_size}
Serviços: {', '.join(budget.services)}
Orçamento: {budget.budget_range}
Prazo: {budget.timeline}

Descrição:
{budget.description}

Enviado em: {budget.timestamp.strftime('%d/%m/%Y às %H:%M')} (UTC)
"""
    send_email(f"Solicitação de Orçamento: {budget.company}", body, reply_to=budget.email)


# ---------------------------------------------------------------------------
# Rotas
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "ALG Tech Hub API", "version": "3.0.0", "status": "online"}


@api_router.post("/contact", response_model=ContactForm, dependencies=[Depends(rate_limit)])
def create_contact(contact_data: ContactFormCreate, background_tasks: BackgroundTasks, request: Request):
    data = contact_data.model_dump(exclude={'website'})
    contact = ContactForm(**data)

    if contact_data.website:
        logger.info("Honeypot acionado em /contact")
        return contact

    connection = get_db_connection()
    try:
        result = DatabaseOperations.create_contact_form(
            connection, contact, client_ip(request), request.headers.get('user-agent')
        )
    finally:
        connection.close()
    background_tasks.add_task(send_contact_email, contact)
    return result


@api_router.get("/contact", dependencies=[Depends(require_admin)])
def get_contacts(limit: int = 100):
    connection = get_db_connection()
    try:
        return {"contacts": DatabaseOperations.get_contact_forms(connection, min(max(limit, 1), 500))}
    finally:
        connection.close()


@api_router.post("/budget", response_model=BudgetRequest, dependencies=[Depends(rate_limit)])
def create_budget_request(budget_data: BudgetRequestCreate, background_tasks: BackgroundTasks):
    budget = BudgetRequest(**budget_data.model_dump(exclude={'website'}))

    if budget_data.website:
        logger.info("Honeypot acionado em /budget")
        return budget

    connection = get_db_connection()
    try:
        result = DatabaseOperations.create_budget_request(connection, budget)
    finally:
        connection.close()
    background_tasks.add_task(send_budget_email, budget)
    return result


app.include_router(api_router)


@app.get("/health")
async def health_check():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        connection.close()
        return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
    except Exception:
        return {"status": "unhealthy", "timestamp": datetime.utcnow().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv('PORT', '8000')))
