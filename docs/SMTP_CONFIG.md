# Configuração SMTP - Gmail

Este documento descreve a configuração do sistema de email SMTP gratuito do Gmail para o projeto ALG Tech Hub.

## 🎯 Visão Geral

O projeto foi migrado do **EmailJS** para o **Gmail SMTP**, eliminando dependências de serviços externos pagos e utilizando o serviço de email gratuito do Google.

## 📧 Email Configurado

- **Email**: `contato@algti.com` (Gmail)
- **Servidor**: `smtp.gmail.com`
- **Porta**: `587` (TLS/STARTTLS)
- **Limite**: 500 emails por dia

> **⚠️ IMPORTANTE**: Para configuração passo a passo, veja [`GMAIL_SMTP_SETUP.md`](./GMAIL_SMTP_SETUP.md)

## 📧 Funcionalidades de Email

O sistema envia emails automaticamente para as seguintes ações:

1. **Formulário de Contato** (`/contact`)
   - Notificação enviada para: `contato@algti.com.br`
   - Dados salvos no MySQL
   - Email enviado via SMTP em background

2. **Solicitação de Orçamento** (Budget Request)
   - Notificação enviada para: `contato@algti.com.br`
   - Dados salvos no MySQL
   - Email enviado via SMTP em background

## ⚙️ Configuração do Backend

### Arquivo `.env` (Backend)

```bash
# Email Configuration - Gmail SMTP
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=contato@algti.com
EMAIL_PASS=sua_senha_de_app_aqui
COMPANY_EMAIL=contato@algti.com
```

### Configurações SMTP do Gmail

- **Servidor SMTP**: `smtp.gmail.com`
- **Porta**: `587` (TLS/STARTTLS)
- **Autenticação**: Sim
- **Usuário**: `contato@algti.com`
- **Senha**: Senha de App (16 caracteres)

### Como Obter a Senha de App do Gmail

1. Ative a **Verificação em 2 Etapas**: https://myaccount.google.com/security
2. Acesse **Senhas de App**: https://myaccount.google.com/apppasswords
3. Selecione "Outro (nome personalizado)"
4. Digite: "ALG Tech Hub Backend"
5. Clique em "Gerar"
6. Copie a senha de 16 caracteres (sem espaços)
7. Cole no `EMAIL_PASS` do arquivo `.env`

> **📖 Guia Completo**: Veja [`GMAIL_SMTP_SETUP.md`](./GMAIL_SMTP_SETUP.md) para instruções detalhadas

## 🔧 Implementação Técnica

### Backend (FastAPI)

O backend utiliza a biblioteca `smtplib` do Python para enviar emails:

```python
# server_mysql.py - Linhas 400-481

async def send_contact_email(contact: ContactForm):
    """Send contact form email via Gmail SMTP"""
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.getenv('SMTP_PORT', '587'))
    email_user = os.getenv('EMAIL_USER', 'contato@algti.com')
    email_pass = os.getenv('EMAIL_PASS', 'senha_de_app')
    
    # Configuração e envio do email...

async def send_budget_email(budget: BudgetRequest):
    """Send budget request email via SMTP"""
    # Similar ao send_contact_email
```

### Frontend (React)

O frontend faz requisições para a API do backend:

```javascript
// api-mysql.js
async submitContact(contactData) {
  const response = await api.post('/api/contact', contactData);
  // Email é enviado automaticamente pelo backend
}

async submitBudgetRequest(budgetData) {
  const response = await api.post('/api/budget', budgetData);
  // Email é enviado automaticamente pelo backend
}
```

## 🚀 Vantagens da Migração

### Antes (EmailJS)
- ❌ Serviço externo pago após limite gratuito
- ❌ Dependência de API externa
- ❌ Configuração no frontend (chaves expostas)
- ❌ Limite de 200 emails/mês no plano gratuito

### Depois (Gmail SMTP)
- ✅ **100% Gratuito**
- ✅ **500 emails por dia** (mais que suficiente)
- ✅ Configuração segura no backend
- ✅ Alta confiabilidade (infraestrutura Google)
- ✅ Melhor segurança (senha de app no servidor)
- ✅ Fácil configuração

## 📝 Alterações Realizadas

### Frontend
1. ✅ Removida dependência `@emailjs/browser` do `package.json`
2. ✅ Removidas configurações do EmailJS do `.env.production`
3. ✅ Atualizado `api-mysql.js` para remover fallback do EmailJS
4. ✅ Atualizado `Contact.js` para usar API do backend

### Backend
1. ✅ Funções `send_contact_email` e `send_budget_email` já implementadas
2. ✅ Configurações SMTP no arquivo `.env`
3. ✅ Envio de emails em background tasks (não bloqueia requisições)

## 🔒 Segurança

- Credenciais SMTP armazenadas apenas no backend (`.env`)
- Nunca exponha as credenciais no frontend
- Use variáveis de ambiente em produção
- Mantenha o arquivo `.env` fora do controle de versão (`.gitignore`)

## 🧪 Testando o Sistema

### 1. Verificar Configurações
```bash
cd backend
cat .env | grep SMTP
```

### 2. Testar Envio de Email
```bash
# Iniciar o backend
cd backend
python server_mysql.py

# Em outro terminal, testar a API
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "subject": "Teste SMTP",
    "message": "Testando envio via SMTP da Hostinger"
  }'
```

### 3. Verificar Logs
```bash
# Verificar logs do backend para confirmar envio
tail -f backend.log
```

## 🐛 Troubleshooting

### Email não está sendo enviado

1. **Verificar credenciais SMTP**
   - Confirme que o email e senha estão corretos
   - Teste fazer login no webmail da Hostinger

2. **Verificar porta e servidor**
   - Porta 587 deve estar aberta no firewall
   - Servidor SMTP deve ser acessível

3. **Verificar logs do backend**
   ```bash
   # Procurar por erros relacionados a SMTP
   grep -i "smtp\|email" backend.log
   ```

4. **Testar conexão SMTP manualmente**
   ```bash
   telnet smtp.gmail.com 587
   ```

### Erro de autenticação

- Verifique se está usando **senha de app** (não a senha normal)
- Confirme que a verificação em 2 etapas está ativa
- Gere uma nova senha de app se necessário
- Verifique se não há espaços na senha

## 📚 Recursos Adicionais

- **[GMAIL_SMTP_SETUP.md](./GMAIL_SMTP_SETUP.md)** - Guia completo passo a passo
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [App Passwords](https://support.google.com/accounts/answer/185833)
- [Python smtplib Documentation](https://docs.python.org/3/library/smtplib.html)
- [FastAPI Background Tasks](https://fastapi.tiangolo.com/tutorial/background-tasks/)

## 📞 Suporte

Para problemas relacionados ao Gmail SMTP:
- Documentação Google: https://support.google.com/mail/answer/7126229
- Email: contato@algti.com

---

**Última atualização**: 25 de Novembro de 2024
**Versão do Sistema**: 2.0.0 (MySQL + SMTP)
