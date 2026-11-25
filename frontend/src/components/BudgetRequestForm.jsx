import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Calculator } from 'lucide-react';
import { useBudgetRequest } from '../hooks/useApi';
import { validators, formatters } from '../services/api';

const BudgetRequestForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    company_size: '',
    services: [],
    budget_range: '',
    timeline: '',
    description: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const { loading: isSubmitting, error, submitBudgetRequest, clearError } = useBudgetRequest();

  const serviceOptions = [
    'Consultoria em TI',
    'Soluções em Software',
    'Help Desk e Suporte',
    'Infraestrutura de Rede',
    'Manutenção de Hardware',
    'Instalação de Software',
    'Administração de TI',
    'Treinamentos',
    'Consultoria LGPD',
    'Câmeras de Segurança - CFTV',
    'Segurança da Informação'
  ];

  const companySizes = [
    { value: '1-10', label: '1-10 funcionários' },
    { value: '11-50', label: '11-50 funcionários' },
    { value: '51-200', label: '51-200 funcionários' },
    { value: '201-500', label: '201-500 funcionários' },
    { value: '500+', label: 'Mais de 500 funcionários' }
  ];

  const budgetRanges = [
    { value: 'under-5k', label: 'Até R$ 5.000' },
    { value: '5k-15k', label: 'R$ 5.000 - R$ 15.000' },
    { value: '15k-30k', label: 'R$ 15.000 - R$ 30.000' },
    { value: '30k-50k', label: 'R$ 30.000 - R$ 50.000' },
    { value: '50k+', label: 'Acima de R$ 50.000' },
    { value: 'custom', label: 'Orçamento personalizado' }
  ];

  const timelines = [
    { value: 'immediate', label: 'Imediato (até 1 semana)' },
    { value: '1-month', label: '1 mês' },
    { value: '3-months', label: '3 meses' },
    { value: '6-months', label: '6 meses' },
    { value: 'flexible', label: 'Flexível' }
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
      clearError();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
    
    // Clear services validation error
    if (validationErrors.services) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.services;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!validators.required(formData.name)) {
      errors.name = 'Nome é obrigatório';
    } else if (!validators.minLength(formData.name, 2)) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!validators.required(formData.email)) {
      errors.email = 'E-mail é obrigatório';
    } else if (!validators.email(formData.email)) {
      errors.email = 'E-mail inválido';
    }
    
    if (formData.phone && !validators.phone(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Telefone inválido';
    }
    
    if (!validators.required(formData.company)) {
      errors.company = 'Nome da empresa é obrigatório';
    }
    
    if (!validators.required(formData.company_size)) {
      errors.company_size = 'Porte da empresa é obrigatório';
    }
    
    if (formData.services.length === 0) {
      errors.services = 'Selecione pelo menos um serviço';
    }
    
    if (!validators.required(formData.budget_range)) {
      errors.budget_range = 'Faixa de orçamento é obrigatória';
    }
    
    if (!validators.required(formData.timeline)) {
      errors.timeline = 'Prazo é obrigatório';
    }
    
    if (!validators.required(formData.description)) {
      errors.description = 'Descrição do projeto é obrigatória';
    } else if (!validators.minLength(formData.description, 20)) {
      errors.description = 'Descrição deve ter pelo menos 20 caracteres';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const honeypot = new FormData(e.currentTarget).get('website');

    try {
      const budgetData = {
        name: formatters.cleanString(formData.name),
        email: formatters.cleanString(formData.email),
        phone: formData.phone ? formatters.phone(formData.phone) : null,
        company: formatters.cleanString(formData.company),
        company_size: formData.company_size,
        services: formData.services,
        budget_range: formData.budget_range,
        timeline: formData.timeline,
        description: formatters.cleanString(formData.description),
        website: honeypot || undefined
      };
      
      await submitBudgetRequest(budgetData);
      
      // Success callback
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (err) {
      console.error('Error submitting budget request:', err);
    }
  };

  return (
    <div className="budget-form-container">
      <div className="budget-form-header">
        <Calculator size={32} style={{ color: 'var(--brand-primary)' }} />
        <h2 className="display-medium">Solicitar Orçamento</h2>
        <p className="body-medium">
          Preencha os dados abaixo para receber uma proposta personalizada
        </p>
      </div>

      <form onSubmit={handleSubmit} className="budget-form">
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}>
          <label>
            Não preencha este campo
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
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

        {/* Personal Information */}
        <div className="form-section">
          <h3 className="heading-2">Informações Pessoais</h3>
          
          <div className="form-row">
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
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="company" className="form-label">Empresa *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className={`form-input ${validationErrors.company ? 'error' : ''}`}
                placeholder="Nome da sua empresa"
              />
              {validationErrors.company && (
                <span className="field-error">{validationErrors.company}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="company_size" className="form-label">Porte da Empresa *</label>
            <select
              id="company_size"
              name="company_size"
              value={formData.company_size}
              onChange={handleInputChange}
              required
              className={`form-select ${validationErrors.company_size ? 'error' : ''}`}
            >
              <option value="">Selecione o porte da empresa</option>
              {companySizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
            {validationErrors.company_size && (
              <span className="field-error">{validationErrors.company_size}</span>
            )}
          </div>
        </div>

        {/* Project Information */}
        <div className="form-section">
          <h3 className="heading-2">Informações do Projeto</h3>
          
          <div className="form-group">
            <label className="form-label">Serviços de Interesse *</label>
            <div className="services-grid">
              {serviceOptions.map((service) => (
                <label key={service} className="service-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceChange(service)}
                  />
                  <span className="checkmark"></span>
                  {service}
                </label>
              ))}
            </div>
            {validationErrors.services && (
              <span className="field-error">{validationErrors.services}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget_range" className="form-label">Faixa de Orçamento *</label>
              <select
                id="budget_range"
                name="budget_range"
                value={formData.budget_range}
                onChange={handleInputChange}
                required
                className={`form-select ${validationErrors.budget_range ? 'error' : ''}`}
              >
                <option value="">Selecione a faixa de orçamento</option>
                {budgetRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              {validationErrors.budget_range && (
                <span className="field-error">{validationErrors.budget_range}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="timeline" className="form-label">Prazo Desejado *</label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                required
                className={`form-select ${validationErrors.timeline ? 'error' : ''}`}
              >
                <option value="">Selecione o prazo</option>
                {timelines.map((timeline) => (
                  <option key={timeline.value} value={timeline.value}>
                    {timeline.label}
                  </option>
                ))}
              </select>
              {validationErrors.timeline && (
                <span className="field-error">{validationErrors.timeline}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Descrição do Projeto *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              required
              className={`form-textarea ${validationErrors.description ? 'error' : ''}`}
              placeholder="Descreva detalhadamente suas necessidades, objetivos e expectativas para o projeto..."
            />
            {validationErrors.description && (
              <span className="field-error">{validationErrors.description}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Solicitar Orçamento"}
            {!isSubmitting && <Send size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetRequestForm;
