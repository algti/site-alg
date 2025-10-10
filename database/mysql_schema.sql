-- ALG Tech Hub - Schema MySQL
-- Conversão das coleções MongoDB para tabelas MySQL
-- Execute este script no cPanel MySQL Database

-- Criar banco de dados (se necessário)
-- CREATE DATABASE alg_tech_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE alg_tech_hub;

-- ========================================
-- 1. Tabela de Status Checks
-- ========================================
CREATE TABLE IF NOT EXISTS status_checks (
    id VARCHAR(36) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_client_name (client_name),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 2. Tabela de Formulários de Contato
-- ========================================
CREATE TABLE IF NOT EXISTS contact_forms (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    company VARCHAR(100) NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    source VARCHAR(50) DEFAULT 'website',
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_timestamp (timestamp),
    INDEX idx_source (source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 3. Tabela de Solicitações de Orçamento
-- ========================================
CREATE TABLE IF NOT EXISTS budget_requests (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    company VARCHAR(100) NOT NULL,
    company_size ENUM('1-10', '11-50', '51-200', '201-500', '500+') NOT NULL,
    budget_range ENUM('under-5k', '5k-15k', '15k-30k', '30k-50k', '50k+', 'custom') NOT NULL,
    timeline ENUM('immediate', '1-month', '3-months', '6-months', 'flexible') NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'reviewing', 'quoted', 'accepted', 'rejected') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_company (company),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 4. Tabela de Serviços (para budget_requests)
-- ========================================
CREATE TABLE IF NOT EXISTS budget_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    budget_request_id VARCHAR(36) NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_request_id) REFERENCES budget_requests(id) ON DELETE CASCADE,
    INDEX idx_budget_request (budget_request_id),
    INDEX idx_service_name (service_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 5. Tabela de Newsletter
-- ========================================
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'unsubscribed') DEFAULT 'active',
    source VARCHAR(50) DEFAULT 'website',
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 6. Tabela de Interesses (para newsletter)
-- ========================================
CREATE TABLE IF NOT EXISTS newsletter_interests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subscription_id VARCHAR(36) NOT NULL,
    interest VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES newsletter_subscriptions(id) ON DELETE CASCADE,
    INDEX idx_subscription (subscription_id),
    INDEX idx_interest (interest)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 7. Tabela de Logs de Sistema
-- ========================================
CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level ENUM('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL') NOT NULL,
    message TEXT NOT NULL,
    module VARCHAR(100) NULL,
    function_name VARCHAR(100) NULL,
    line_number INT NULL,
    user_id VARCHAR(36) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    extra_data JSON NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_level (level),
    INDEX idx_timestamp (timestamp),
    INDEX idx_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 8. Views para Relatórios
-- ========================================

-- View: Estatísticas de Contatos
CREATE OR REPLACE VIEW contact_stats AS
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as total_contacts,
    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_contacts,
    COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_contacts,
    COUNT(DISTINCT email) as unique_emails
FROM contact_forms 
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- View: Estatísticas de Orçamentos
CREATE OR REPLACE VIEW budget_stats AS
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as total_requests,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
    COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_requests,
    budget_range,
    company_size
FROM budget_requests 
GROUP BY DATE(timestamp), budget_range, company_size
ORDER BY date DESC;

-- ========================================
-- 9. Triggers para Auditoria
-- ========================================

-- Trigger para log de alterações em contatos
DELIMITER //
CREATE TRIGGER contact_forms_audit 
AFTER UPDATE ON contact_forms
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO system_logs (level, message, module, extra_data)
        VALUES (
            'INFO',
            CONCAT('Contact status changed from ', OLD.status, ' to ', NEW.status),
            'contact_forms',
            JSON_OBJECT(
                'contact_id', NEW.id,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'email', NEW.email
            )
        );
    END IF;
END//
DELIMITER ;

-- ========================================
-- 10. Dados Iniciais (Opcional)
-- ========================================

-- Inserir alguns dados de exemplo para teste
INSERT IGNORE INTO contact_forms (id, name, email, subject, message, status) VALUES
('test-1', 'João Silva', 'joao@teste.com', 'Teste de Contato', 'Esta é uma mensagem de teste.', 'new'),
('test-2', 'Maria Santos', 'maria@teste.com', 'Consultoria TI', 'Gostaria de saber mais sobre consultoria.', 'new');

-- ========================================
-- 11. Usuário para Aplicação (Execute no cPanel)
-- ========================================
/*
-- Criar usuário específico para a aplicação
CREATE USER 'alg_app'@'localhost' IDENTIFIED BY 'senha_segura_aqui';

-- Conceder permissões necessárias
GRANT SELECT, INSERT, UPDATE, DELETE ON alg_tech_hub.* TO 'alg_app'@'localhost';
GRANT CREATE TEMPORARY TABLES ON alg_tech_hub.* TO 'alg_app'@'localhost';

-- Aplicar mudanças
FLUSH PRIVILEGES;
*/

-- ========================================
-- Fim do Schema
-- ========================================
