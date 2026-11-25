# 📧 Configuração Gmail SMTP - Guia Completo

Este guia mostra como configurar o **Gmail SMTP gratuito** para enviar emails do sistema ALG Tech Hub.

## 🎯 Por que Gmail SMTP?

- ✅ **100% Gratuito**
- ✅ **500 emails por dia** (mais que suficiente)
- ✅ **Alta confiabilidade** (infraestrutura do Google)
- ✅ **Fácil configuração**
- ✅ **Seguro** (credenciais no backend)

## 🔐 Passo a Passo: Gerar Senha de App

### ⚠️ IMPORTANTE
**NÃO use a senha normal da sua conta Gmail!**  
Você precisa gerar uma **"Senha de App"** específica para o sistema.

### Passo 1: Ativar Verificação em 2 Etapas

1. Acesse: https://myaccount.google.com/security
2. Role até **"Como fazer login no Google"**
3. Clique em **"Verificação em duas etapas"**
4. Siga as instruções para ativar (se ainda não estiver ativo)
5. Você precisará confirmar com seu telefone

![Verificação em 2 etapas](https://i.imgur.com/example1.png)

### Passo 2: Gerar Senha de App

1. Acesse: https://myaccount.google.com/apppasswords
2. Faça login com sua conta `contato@algti.com`
3. Em **"Selecionar app"**, escolha: **"Outro (nome personalizado)"**
4. Digite: **"ALG Tech Hub Backend"**
5. Clique em **"Gerar"**
6. O Google mostrará uma senha de 16 caracteres

   Exemplo: `abcd efgh ijkl mnop`

7. **COPIE ESTA SENHA** (você não poderá vê-la novamente)

![Senha de App](https://i.imgur.com/example2.png)

### Passo 3: Configurar no Backend

1. Abra o arquivo `backend/.env`
2. Cole a senha **SEM ESPAÇOS**:

```bash
# Email Configuration - Gmail SMTP
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=contato@algti.com
EMAIL_PASS=abcdefghijklmnop  # ← Senha de 16 caracteres SEM espaços
COMPANY_EMAIL=contato@algti.com
```

## ⚙️ Configurações SMTP do Gmail

```
Servidor SMTP: smtp.gmail.com
Porta: 587 (TLS/STARTTLS)
Requer autenticação: Sim
Usuário: contato@algti.com
Senha: [Senha de App de 16 caracteres]
```

## 🧪 Testar a Configuração

### 1. Testar via Python (Rápido)

Crie um arquivo `test_gmail_smtp.py`:

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Suas credenciais
smtp_server = "smtp.gmail.com"
smtp_port = 587
email_user = "contato@algti.com"
email_pass = "sua_senha_de_app_aqui"  # 16 caracteres

try:
    # Criar mensagem
    msg = MIMEMultipart()
    msg['From'] = email_user
    msg['To'] = email_user
    msg['Subject'] = "Teste SMTP Gmail - ALG Tech Hub"
    
    body = "Este é um email de teste do sistema ALG Tech Hub usando Gmail SMTP."
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    
    # Conectar e enviar
    print("Conectando ao Gmail SMTP...")
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    
    print("Fazendo login...")
    server.login(email_user, email_pass)
    
    print("Enviando email...")
    server.send_message(msg)
    server.quit()
    
    print("✅ Email enviado com sucesso!")
    print(f"Verifique a caixa de entrada de {email_user}")
    
except Exception as e:
    print(f"❌ Erro ao enviar email: {e}")
```

Execute:
```bash
cd backend
python test_gmail_smtp.py
```

### 2. Testar via API Backend

```bash
# Iniciar o backend
cd backend
python server_mysql.py

# Em outro terminal, testar
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Gmail",
    "email": "teste@example.com",
    "subject": "Teste SMTP Gmail",
    "message": "Testando envio via Gmail SMTP"
  }'
```

Verifique se o email chegou em `contato@algti.com`.

## 🐛 Troubleshooting

### Erro: "Username and Password not accepted"

**Causa**: Senha incorreta ou não é uma senha de app.

**Solução**:
1. Verifique se você está usando a **senha de app** (16 caracteres)
2. Verifique se não há espaços na senha
3. Gere uma nova senha de app se necessário

### Erro: "Application-specific password required"

**Causa**: Verificação em 2 etapas não está ativa.

**Solução**:
1. Ative a verificação em 2 etapas
2. Gere uma nova senha de app

### Erro: "SMTP AUTH extension not supported"

**Causa**: Porta ou servidor incorretos.

**Solução**:
```bash
SMTP_SERVER=smtp.gmail.com  # Não smtp.google.com
SMTP_PORT=587               # Não 465 ou 25
```

### Erro: "Connection refused" ou "Timeout"

**Causa**: Firewall bloqueando porta 587.

**Solução**:
```bash
# Verificar se porta está aberta
telnet smtp.gmail.com 587

# Se não funcionar, verificar firewall
sudo ufw allow 587/tcp
```

### Email vai para SPAM

**Solução**:
1. Configure SPF no DNS do domínio
2. Configure DKIM (opcional)
3. Envie de um domínio verificado
4. Evite palavras de spam no assunto

## 📊 Limites do Gmail SMTP

| Limite | Valor |
|--------|-------|
| Emails por dia | 500 |
| Destinatários por email | 100 |
| Tamanho máximo do email | 25 MB |
| Anexos | Suportado |

**Nota**: Para um site institucional, 500 emails/dia é mais que suficiente.

## 🔒 Segurança

### ✅ Boas Práticas

- Use senha de app, não a senha da conta
- Mantenha `.env` no `.gitignore`
- Nunca commite credenciais no Git
- Use variáveis de ambiente em produção
- Revogue senhas de app não utilizadas

### 🚫 Não Faça

- ❌ Não use a senha normal da conta Gmail
- ❌ Não exponha credenciais no frontend
- ❌ Não commite o arquivo `.env`
- ❌ Não compartilhe senhas de app

## 🔄 Revogar Senha de App

Se você precisar revogar uma senha de app:

1. Acesse: https://myaccount.google.com/apppasswords
2. Encontre "ALG Tech Hub Backend"
3. Clique em **"Remover"**
4. Gere uma nova senha se necessário

## 📚 Recursos Adicionais

- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [App Passwords](https://support.google.com/accounts/answer/185833)
- [2-Step Verification](https://support.google.com/accounts/answer/185839)
- [SMTP Errors](https://support.google.com/mail/answer/7126229#zippy=%2Csmtp-settings)

## 💡 Dicas

### Monitorar Envios

Você pode ver todos os emails enviados em:
- Gmail → Enviados
- Ou configure um BCC automático

### Usar Alias

Se quiser usar um alias (ex: `noreply@algti.com`), configure no Gmail:
1. Gmail → Configurações → Contas
2. Adicionar outro endereço de email
3. Use o alias como remetente

### Backup de Credenciais

Salve a senha de app em um gerenciador de senhas seguro:
- 1Password
- LastPass
- Bitwarden

## ✅ Checklist Final

- [ ] Verificação em 2 etapas ativada
- [ ] Senha de app gerada
- [ ] Senha copiada sem espaços
- [ ] Configurada no `backend/.env`
- [ ] Teste enviado com sucesso
- [ ] Email recebido em `contato@algti.com`
- [ ] Backend reiniciado
- [ ] Senha de app salva em local seguro

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do backend
2. Teste com o script Python acima
3. Consulte a documentação do Google
4. Entre em contato: contato@algti.com

---

**Última atualização**: 25 de Novembro de 2024  
**Email configurado**: contato@algti.com  
**Status**: ✅ Pronto para uso
