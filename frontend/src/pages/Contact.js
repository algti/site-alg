import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useApi, validators, formatters } from '../services/api-mysql';
import { useSEO } from '../hooks/useSEO';

const Contact = () => {
  // Setup SEO for contact page
  useSEO('contact');

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const subjects = [
    "Consultoria em TI",
    "Soluções em Software", 
    "Help Desk e Suporte",
    "Infraestrutura de Rede",
    "Manutenção de Hardware",
    "Instalação de Software",
    "Administração de TI",
    "Treinamentos",
    "Consultoria LGPD",
    "Orçamento Personalizado",
    "Outros"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear API error when user starts typing
    if (error) {
      setError(null);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = "Nome é obrigatório e deve ter pelo menos 2 caracteres";
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "E-mail válido é obrigatório";
    }
    
    if (formData.phone && !/^[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      errors.phone = "Telefone inválido";
    }
    
    if (!formData.subject) {
      errors.subject = "Assunto é obrigatório";
    }
    
    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = "Mensagem é obrigatória e deve ter pelo menos 10 caracteres";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Enviar via EmailJS
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_alg_tech',
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_contact',
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone || 'Não informado',
          company: formData.company || 'Não informado',
          subject: formData.subject,
          message: formData.message,
          to_email: 'contato@algti.com'
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'sua_public_key'
      );
      
      // Success - show success message
      setSuccess(true);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setValidationErrors({});
      
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="contact">
        <section className="contact-success section-large">
          <div className="container">
            <div className="success-content">
              <CheckCircle size={80} style={{ color: "var(--brand-primary)", marginBottom: "32px" }} />
              <h1 className="display-large">Mensagem Enviada com Sucesso!</h1>
              <p className="body-large" style={{ margin: "32px 0 48px", maxWidth: "600px" }}>
                Obrigado pelo seu interesse! Nossa equipe entrará em contato em até 24 horas 
                para discutir como podemos ajudar sua empresa a crescer através da tecnologia.
              </p>
              <button 
                className="btn-primary"
                onClick={() => setIsSubmitted(false)}
              >
                Enviar Nova Mensagem
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="contact">
      {/* Hero Section */}
      <section className="contact-hero section">
        <div className="container">
          <div className="hero-content">
            <h1 className="display-large">
              Entre em{" "}
              <span style={{ color: "var(--brand-primary)" }}>Contato</span>
            </h1>
            <p className="body-large" style={{ marginTop: "32px", maxWidth: "800px" }}>
              Pronto para transformar sua empresa através da tecnologia? 
              Estamos está aqui para ajudar você a alcançar seus objetivos.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="contact-content section">
        <div className="container">
          <div className="grid grid-2" style={{ gap: "80px" }}>
            {/* Contact Form */}
            <div className="contact-form-container">
              <h2 className="display-medium">Solicite uma Apresentação</h2>
              <p className="body-medium" style={{ margin: "24px 0 48px" }}>
                Preencha o formulário abaixo e entraremos em contato 
                para entender suas necessidades e apresentar as melhores soluções.
              </p>

              <form onSubmit={handleSubmit} className="contact-form">
                {error && (
                  <div className="error-message" style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <AlertCircle size={20} style={{ color: '#ef4444' }} />
                    <span style={{ color: '#ef4444' }}>{error}</span>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nome Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`form-input ${validationErrors.name ? 'error' : ''}`}
                    placeholder="Seu nome completo"
                  />
                  {validationErrors.name && (
                    <span className="field-error">{validationErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="company" className="form-label">Empresa</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.company ? 'error' : ''}`}
                    placeholder="Nome da sua empresa (opcional)"
                  />
                  {validationErrors.company && (
                    <span className="field-error">{validationErrors.company}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">E-mail *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`form-input ${validationErrors.email ? 'error' : ''}`}
                      placeholder="seu@email.com"
                    />
                    {validationErrors.email && (
                      <span className="field-error">{validationErrors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Telefone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-input ${validationErrors.phone ? 'error' : ''}`}
                      placeholder="(43) 99999-9999"
                    />
                    {validationErrors.phone && (
                      <span className="field-error">{validationErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Assunto *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`form-select ${validationErrors.subject ? 'error' : ''}`}
                  >
                    <option value="">Selecione um assunto</option>
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {validationErrors.subject && (
                    <span className="field-error">{validationErrors.subject}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Mensagem *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    required
                    className={`form-textarea ${validationErrors.message ? 'error' : ''}`}
                    placeholder="Conte-nos mais sobre suas necessidades..."
                  />
                  {validationErrors.message && (
                    <span className="field-error">{validationErrors.message}</span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn-primary form-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  {!isSubmitting && <Send size={20} />}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info-container">
              <h2 className="display-medium">Informações de Contato</h2>
              <p className="body-medium" style={{ margin: "24px 0 48px" }}>
                Estamos sempre disponíveis para atender você. 
                Entre em contato através dos canais abaixo.
              </p>

              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="detail-icon">
                    <Phone size={24} style={{ color: "var(--brand-primary)" }} />
                  </div>
                  <div className="detail-content">
                    <h3 className="heading-3">Telefone</h3>
                    <p className="body-medium">+55 (43) 99962-5471</p>
                    <p className="body-small">Atendimento via WhatsApp disponível</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">
                    <Mail size={24} style={{ color: "var(--brand-primary)" }} />
                  </div>
                  <div className="detail-content">
                    <h3 className="heading-3">E-mail</h3>
                    <p className="body-medium">contato@algti.com</p>
                    <p className="body-small">Resposta garantida em até 24h</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">
                    <MapPin size={24} style={{ color: "var(--brand-primary)" }} />
                  </div>
                  <div className="detail-content">
                    <h3 className="heading-3">Localização</h3>
                    <p className="body-medium">Londrina - Paraná</p>
                    <p className="body-small">Atendimento presencial e remoto</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">
                    <Clock size={24} style={{ color: "var(--brand-primary)" }} />
                  </div>
                  <div className="detail-content">
                    <h3 className="heading-3">Horário de Funcionamento</h3>
                    <p className="body-medium">Segunda à Sexta: 8h às 18h </p>
                    <p className="body-small">Suporte emergencial 24/7 disponível</p>
                  </div>
                </div>
              </div>

              <div className="client-area-info">
                <h3 className="heading-2">Já é nosso cliente?</h3>
                <p className="body-medium" style={{ margin: "16px 0 24px" }}>
                  Acesse nossa área exclusiva para clientes e abra chamados, 
                  acompanhe projetos e acesse recursos exclusivos.
                </p>
                <a 
                  href="https://ticket.algti.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Acessar Área do Cliente
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="emergency-contact section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="emergency-content">
            <h2 className="display-medium">Suporte de Emergência</h2>
            <p className="body-large" style={{ margin: "24px 0 48px" }}>
              Problemas críticos de TI não podem esperar. Estamos disponíveis  
              24/7 para emergências que afetam a operação do seu negócio.
            </p>
            <div className="emergency-actions">
              <a href="tel:+5543999625471" className="btn-primary">
                Ligar Agora: (43) 99962-5471
              </a>
              <p className="body-small" style={{ marginTop: "16px" }}>
                Suporte emergencial com tempo de resposta garantido
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;