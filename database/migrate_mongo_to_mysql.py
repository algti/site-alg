#!/usr/bin/env python3
"""
ALG Tech Hub - Migração MongoDB para MySQL
Script para migrar dados existentes do MongoDB para MySQL
"""

import os
import sys
import json
import logging
from datetime import datetime
from pathlib import Path
import uuid

# Imports MongoDB
try:
    from pymongo import MongoClient
    MONGO_AVAILABLE = True
except ImportError:
    print("⚠️ PyMongo não instalado. Execute: pip install pymongo")
    MONGO_AVAILABLE = False

# Imports MySQL
try:
    import mysql.connector
    from mysql.connector import Error
    MYSQL_AVAILABLE = True
except ImportError:
    print("⚠️ MySQL Connector não instalado. Execute: pip install mysql-connector-python")
    MYSQL_AVAILABLE = False

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('migration.log'),
        logging.StreamHandler()
    ]
)

class MongoToMySQLMigrator:
    def __init__(self, mongo_url, mysql_config):
        self.mongo_url = mongo_url
        self.mysql_config = mysql_config
        self.mongo_client = None
        self.mysql_connection = None
        self.migration_stats = {
            'status_checks': {'migrated': 0, 'errors': 0},
            'contact_forms': {'migrated': 0, 'errors': 0},
            'budget_requests': {'migrated': 0, 'errors': 0},
            'newsletter_subscriptions': {'migrated': 0, 'errors': 0}
        }
    
    def connect_databases(self):
        """Conectar aos bancos de dados"""
        try:
            # Conectar MongoDB
            if MONGO_AVAILABLE:
                self.mongo_client = MongoClient(self.mongo_url)
                self.mongo_db = self.mongo_client.get_default_database()
                logging.info("✅ Conectado ao MongoDB")
            else:
                logging.error("❌ MongoDB não disponível")
                return False
            
            # Conectar MySQL
            if MYSQL_AVAILABLE:
                self.mysql_connection = mysql.connector.connect(**self.mysql_config)
                logging.info("✅ Conectado ao MySQL")
            else:
                logging.error("❌ MySQL não disponível")
                return False
            
            return True
            
        except Exception as e:
            logging.error(f"❌ Erro ao conectar bancos: {e}")
            return False
    
    def migrate_status_checks(self):
        """Migrar status checks"""
        logging.info("🔄 Migrando status checks...")
        
        try:
            # Buscar dados do MongoDB
            mongo_collection = self.mongo_db.status_checks
            documents = list(mongo_collection.find())
            
            if not documents:
                logging.info("ℹ️ Nenhum status check encontrado no MongoDB")
                return
            
            # Inserir no MySQL
            cursor = self.mysql_connection.cursor()
            
            for doc in documents:
                try:
                    # Converter ObjectId para string se necessário
                    doc_id = str(doc.get('_id', str(uuid.uuid4())))
                    if doc_id.startswith('ObjectId'):
                        doc_id = str(uuid.uuid4())
                    
                    query = """
                    INSERT IGNORE INTO status_checks (id, client_name, timestamp)
                    VALUES (%s, %s, %s)
                    """
                    
                    cursor.execute(query, (
                        doc.get('id', doc_id),
                        doc.get('client_name', ''),
                        doc.get('timestamp', datetime.utcnow())
                    ))
                    
                    self.migration_stats['status_checks']['migrated'] += 1
                    
                except Exception as e:
                    logging.error(f"Erro ao migrar status check {doc.get('_id')}: {e}")
                    self.migration_stats['status_checks']['errors'] += 1
            
            self.mysql_connection.commit()
            cursor.close()
            
            logging.info(f"✅ Status checks migrados: {self.migration_stats['status_checks']['migrated']}")
            
        except Exception as e:
            logging.error(f"❌ Erro na migração de status checks: {e}")
    
    def migrate_contact_forms(self):
        """Migrar formulários de contato"""
        logging.info("🔄 Migrando formulários de contato...")
        
        try:
            mongo_collection = self.mongo_db.contact_forms
            documents = list(mongo_collection.find())
            
            if not documents:
                logging.info("ℹ️ Nenhum formulário de contato encontrado no MongoDB")
                return
            
            cursor = self.mysql_connection.cursor()
            
            for doc in documents:
                try:
                    doc_id = str(doc.get('_id', str(uuid.uuid4())))
                    if doc_id.startswith('ObjectId'):
                        doc_id = str(uuid.uuid4())
                    
                    query = """
                    INSERT IGNORE INTO contact_forms 
                    (id, name, email, phone, company, subject, message, timestamp, status, source)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    
                    cursor.execute(query, (
                        doc.get('id', doc_id),
                        doc.get('name', ''),
                        doc.get('email', ''),
                        doc.get('phone'),
                        doc.get('company'),
                        doc.get('subject', ''),
                        doc.get('message', ''),
                        doc.get('timestamp', datetime.utcnow()),
                        doc.get('status', 'new'),
                        doc.get('source', 'website')
                    ))
                    
                    self.migration_stats['contact_forms']['migrated'] += 1
                    
                except Exception as e:
                    logging.error(f"Erro ao migrar contact form {doc.get('_id')}: {e}")
                    self.migration_stats['contact_forms']['errors'] += 1
            
            self.mysql_connection.commit()
            cursor.close()
            
            logging.info(f"✅ Formulários de contato migrados: {self.migration_stats['contact_forms']['migrated']}")
            
        except Exception as e:
            logging.error(f"❌ Erro na migração de contact forms: {e}")
    
    def migrate_budget_requests(self):
        """Migrar solicitações de orçamento"""
        logging.info("🔄 Migrando solicitações de orçamento...")
        
        try:
            mongo_collection = self.mongo_db.budget_requests
            documents = list(mongo_collection.find())
            
            if not documents:
                logging.info("ℹ️ Nenhuma solicitação de orçamento encontrada no MongoDB")
                return
            
            cursor = self.mysql_connection.cursor()
            
            for doc in documents:
                try:
                    doc_id = str(doc.get('_id', str(uuid.uuid4())))
                    if doc_id.startswith('ObjectId'):
                        doc_id = str(uuid.uuid4())
                    
                    # Inserir budget request
                    query = """
                    INSERT IGNORE INTO budget_requests 
                    (id, name, email, phone, company, company_size, budget_range, timeline, description, timestamp, status, priority)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    
                    cursor.execute(query, (
                        doc.get('id', doc_id),
                        doc.get('name', ''),
                        doc.get('email', ''),
                        doc.get('phone'),
                        doc.get('company', ''),
                        doc.get('company_size', '1-10'),
                        doc.get('budget_range', 'under-5k'),
                        doc.get('timeline', 'flexible'),
                        doc.get('description', ''),
                        doc.get('timestamp', datetime.utcnow()),
                        doc.get('status', 'pending'),
                        doc.get('priority', 'medium')
                    ))
                    
                    # Inserir serviços
                    services = doc.get('services', [])
                    for service in services:
                        service_query = """
                        INSERT IGNORE INTO budget_services (budget_request_id, service_name)
                        VALUES (%s, %s)
                        """
                        cursor.execute(service_query, (doc.get('id', doc_id), service))
                    
                    self.migration_stats['budget_requests']['migrated'] += 1
                    
                except Exception as e:
                    logging.error(f"Erro ao migrar budget request {doc.get('_id')}: {e}")
                    self.migration_stats['budget_requests']['errors'] += 1
            
            self.mysql_connection.commit()
            cursor.close()
            
            logging.info(f"✅ Solicitações de orçamento migradas: {self.migration_stats['budget_requests']['migrated']}")
            
        except Exception as e:
            logging.error(f"❌ Erro na migração de budget requests: {e}")
    
    def migrate_newsletter_subscriptions(self):
        """Migrar assinaturas de newsletter"""
        logging.info("🔄 Migrando assinaturas de newsletter...")
        
        try:
            mongo_collection = self.mongo_db.newsletter_subscriptions
            documents = list(mongo_collection.find())
            
            if not documents:
                logging.info("ℹ️ Nenhuma assinatura de newsletter encontrada no MongoDB")
                return
            
            cursor = self.mysql_connection.cursor()
            
            for doc in documents:
                try:
                    doc_id = str(doc.get('_id', str(uuid.uuid4())))
                    if doc_id.startswith('ObjectId'):
                        doc_id = str(uuid.uuid4())
                    
                    # Inserir subscription
                    query = """
                    INSERT IGNORE INTO newsletter_subscriptions 
                    (id, email, name, timestamp, status, source)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """
                    
                    cursor.execute(query, (
                        doc.get('id', doc_id),
                        doc.get('email', ''),
                        doc.get('name'),
                        doc.get('timestamp', datetime.utcnow()),
                        doc.get('status', 'active'),
                        doc.get('source', 'website')
                    ))
                    
                    # Inserir interesses
                    interests = doc.get('interests', [])
                    for interest in interests:
                        interest_query = """
                        INSERT IGNORE INTO newsletter_interests (subscription_id, interest)
                        VALUES (%s, %s)
                        """
                        cursor.execute(interest_query, (doc.get('id', doc_id), interest))
                    
                    self.migration_stats['newsletter_subscriptions']['migrated'] += 1
                    
                except Exception as e:
                    logging.error(f"Erro ao migrar newsletter subscription {doc.get('_id')}: {e}")
                    self.migration_stats['newsletter_subscriptions']['errors'] += 1
            
            self.mysql_connection.commit()
            cursor.close()
            
            logging.info(f"✅ Assinaturas de newsletter migradas: {self.migration_stats['newsletter_subscriptions']['migrated']}")
            
        except Exception as e:
            logging.error(f"❌ Erro na migração de newsletter subscriptions: {e}")
    
    def export_to_json_backup(self):
        """Exportar dados do MongoDB para backup JSON"""
        logging.info("📦 Criando backup JSON dos dados do MongoDB...")
        
        try:
            backup_data = {}
            
            # Exportar cada coleção
            collections = ['status_checks', 'contact_forms', 'budget_requests', 'newsletter_subscriptions']
            
            for collection_name in collections:
                try:
                    collection = self.mongo_db[collection_name]
                    documents = list(collection.find())
                    
                    # Converter ObjectId para string
                    for doc in documents:
                        if '_id' in doc:
                            doc['_id'] = str(doc['_id'])
                        if 'timestamp' in doc and hasattr(doc['timestamp'], 'isoformat'):
                            doc['timestamp'] = doc['timestamp'].isoformat()
                    
                    backup_data[collection_name] = documents
                    logging.info(f"✅ Exportados {len(documents)} documentos de {collection_name}")
                    
                except Exception as e:
                    logging.error(f"Erro ao exportar {collection_name}: {e}")
                    backup_data[collection_name] = []
            
            # Salvar backup
            backup_file = f"mongodb_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(backup_data, f, ensure_ascii=False, indent=2, default=str)
            
            logging.info(f"📦 Backup salvo em: {backup_file}")
            
        except Exception as e:
            logging.error(f"❌ Erro ao criar backup: {e}")
    
    def run_migration(self):
        """Executar migração completa"""
        logging.info("🚀 Iniciando migração MongoDB → MySQL")
        
        if not self.connect_databases():
            return False
        
        try:
            # Criar backup antes da migração
            self.export_to_json_backup()
            
            # Executar migrações
            self.migrate_status_checks()
            self.migrate_contact_forms()
            self.migrate_budget_requests()
            self.migrate_newsletter_subscriptions()
            
            # Relatório final
            logging.info("📊 Relatório de Migração:")
            for table, stats in self.migration_stats.items():
                logging.info(f"  {table}: {stats['migrated']} migrados, {stats['errors']} erros")
            
            total_migrated = sum(stats['migrated'] for stats in self.migration_stats.values())
            total_errors = sum(stats['errors'] for stats in self.migration_stats.values())
            
            logging.info(f"🎯 Total: {total_migrated} registros migrados, {total_errors} erros")
            
            if total_errors == 0:
                logging.info("✅ Migração concluída com sucesso!")
            else:
                logging.warning(f"⚠️ Migração concluída com {total_errors} erros")
            
            return True
            
        except Exception as e:
            logging.error(f"❌ Erro durante migração: {e}")
            return False
        
        finally:
            # Fechar conexões
            if self.mongo_client:
                self.mongo_client.close()
            if self.mysql_connection:
                self.mysql_connection.close()

def main():
    """Função principal"""
    print("🔄 ALG Tech Hub - Migração MongoDB → MySQL")
    print("=" * 50)
    
    # Verificar dependências
    if not MONGO_AVAILABLE or not MYSQL_AVAILABLE:
        print("❌ Dependências não instaladas. Execute:")
        print("pip install pymongo mysql-connector-python")
        return
    
    # Configurações (ajuste conforme necessário)
    mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017/alg_tech_hub')
    
    mysql_config = {
        'host': os.getenv('MYSQL_HOST', 'localhost'),
        'database': os.getenv('MYSQL_DATABASE', 'alg_tech_hub'),
        'user': os.getenv('MYSQL_USER', 'alg_app'),
        'password': os.getenv('MYSQL_PASSWORD', 'senha_segura'),
        'charset': 'utf8mb4',
        'collation': 'utf8mb4_unicode_ci'
    }
    
    print(f"MongoDB: {mongo_url}")
    print(f"MySQL: {mysql_config['user']}@{mysql_config['host']}/{mysql_config['database']}")
    print()
    
    # Confirmar migração
    confirm = input("Deseja continuar com a migração? (s/N): ").lower().strip()
    if confirm not in ['s', 'sim', 'y', 'yes']:
        print("❌ Migração cancelada")
        return
    
    # Executar migração
    migrator = MongoToMySQLMigrator(mongo_url, mysql_config)
    success = migrator.run_migration()
    
    if success:
        print("\n🎉 Migração concluída! Verifique o arquivo migration.log para detalhes.")
    else:
        print("\n❌ Migração falhou. Verifique o arquivo migration.log para detalhes.")

if __name__ == "__main__":
    main()
