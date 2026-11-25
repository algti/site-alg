# 🚀 Guia de Migração: EmailJS → SMTP Hostinger

## ✅ Migração Concluída

Este projeto foi **migrado com sucesso** do EmailJS para o sistema SMTP gratuito da Hostinger.

## 📋 Resumo das Alterações

### ❌ Removido
- Dependência `@emailjs/browser` do frontend
- Configurações do EmailJS no `.env.production`
- Código de fallback do EmailJS no `api-mysql.js`
- Chamadas diretas ao EmailJS no `Contact.js`

### ✅ Implementado
- Sistema SMTP completo no backend usando `smtplib`
- Envio de emails em background tasks (não bloqueia requisições)
- Configurações seguras no backend (`.env`)
- Suporte para formulário de contato e solicitação de orçamento

## 🔧 Próximos Passos para Produção

### 1. Atualizar Credenciais SMTP

Edite o arquivo `backend/.env` com suas credenciais reais da Hostinger:

```bash
cd backend
nano .env
```

Atualize estas linhas:
```bash
SMTP_SERVER=mail.algti.com.br          # Seu servidor SMTP
EMAIL_USER=contato@algti.com.br        # Seu email completo
EMAIL_PASS=sua_senha_real_aqui         # Senha do email
```

### 2. Reinstalar Dependências do Frontend

```bash
cd frontend
yarn install
# ou
npm install
```

Isso removerá o pacote `@emailjs/browser` que não é mais necessário.

### 3. Testar o Sistema Localmente

#### Backend
```bash
cd backend
python server_mysql.py
```

#### Frontend
```bash
cd frontend
yarn start
# ou
npm start
```

#### Testar Envio de Email
1. Acesse `http://localhost:3000/contact`
2. Preencha o formulário de contato
3. Envie e verifique se o email chegou em `contato@algti.com.br`

### 4. Build para Produção

```bash
cd frontend
yarn build
# ou
npm run build
```

### 5. Deploy na VPS Hostinger

#### Fazer Upload dos Arquivos
```bash
# Via SCP ou SFTP
scp -r build/* usuario@seu-servidor:/caminho/para/frontend
scp -r backend/* usuario@seu-servidor:/caminho/para/backend
```

#### Configurar Variáveis de Ambiente
```bash
# No servidor VPS
cd /caminho/para/backend
nano .env
# Preencha com as credenciais de produção
```

#### Reiniciar Serviços
```bash
# Backend (FastAPI)
systemctl restart alg-backend
# ou
pm2 restart alg-backend

# Nginx (se aplicável)
systemctl restart nginx
```

## 🧪 Verificação Pós-Deploy

### 1. Testar API Backend
```bash
curl https://algti.com.br/health
```

Resposta esperada:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-11-25T..."
}
```

### 2. Testar Envio de Email
```bash
curl -X POST https://algti.com.br/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Produção",
    "email": "teste@example.com",
    "subject": "Teste SMTP",
    "message": "Testando sistema SMTP em produção"
  }'
```

### 3. Verificar Logs
```bash
# Backend logs
tail -f /var/log/alg-backend.log

# Nginx logs (se aplicável)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 📊 Comparação: Antes vs Depois

| Aspecto | EmailJS (Antes) | SMTP Hostinger (Depois) |
|---------|----------------|-------------------------|
| **Custo** | Pago após 200 emails/mês | 100% Gratuito |
| **Limite** | 200 emails/mês (grátis) | Sem limites práticos |
| **Segurança** | Chaves no frontend | Credenciais no backend |
| **Controle** | Dependência externa | Controle total |
| **Confiabilidade** | Depende do serviço | Servidor próprio |
| **Configuração** | Frontend + Backend | Apenas Backend |

## 🔒 Checklist de Segurança

- [ ] Arquivo `.env` está no `.gitignore`
- [ ] Credenciais SMTP não estão commitadas no Git
- [ ] Senha do email é forte e única
- [ ] CORS está configurado corretamente
- [ ] SSL/TLS está habilitado (porta 587)
- [ ] Logs não expõem informações sensíveis

## 📚 Documentação Adicional

- **Configuração SMTP**: Ver `SMTP_CONFIG.md`
- **Troubleshooting**: Ver seção no `SMTP_CONFIG.md`
- **API Backend**: Ver `backend/server_mysql.py`

## 🐛 Problemas Conhecidos e Soluções

### Email não está sendo enviado
1. Verificar credenciais no `.env`
2. Testar login no webmail da Hostinger
3. Verificar logs do backend: `grep -i smtp backend.log`
4. Confirmar que porta 587 está aberta

### Erro 500 ao submeter formulário
1. Verificar conexão com MySQL
2. Verificar logs do backend
3. Testar endpoint `/health`

### Frontend não conecta ao backend
1. Verificar `REACT_APP_API_URL` no `.env.production`
2. Verificar CORS no backend
3. Verificar se backend está rodando

## 📞 Suporte

- **Documentação**: Ver `SMTP_CONFIG.md`
- **Issues**: Criar issue no repositório
- **Email**: contato@algti.com.br

## ✨ Benefícios da Migração

1. **💰 Economia**: Sem custos com EmailJS
2. **🔒 Segurança**: Credenciais protegidas no servidor
3. **⚡ Performance**: Envio em background, não bloqueia UI
4. **🎯 Controle**: Servidor de email próprio
5. **📈 Escalabilidade**: Sem limites de envio

---

**Status**: ✅ Migração Completa  
**Data**: 25 de Novembro de 2024  
**Versão**: 2.0.0 (MySQL + SMTP)
