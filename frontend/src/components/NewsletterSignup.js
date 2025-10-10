import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useNewsletter } from '../hooks/useApi';
import { validators, formatters } from '../services/api';

const NewsletterSignup = ({ inline = false, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    interests: []
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const { loading: isSubmitting, error, subscribe, clearError } = useNewsletter();

  const interestOptions = [
    'Tendências em Tecnologia',
    'Segurança Digital',
    'LGPD e Compliance',
    'Cases de Sucesso',
    'Ofertas Especiais',
    'Dicas de TI'
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

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!validators.required(formData.email)) {
      errors.email = 'E-mail é obrigatório';
    } else if (!validators.email(formData.email)) {
      errors.email = 'E-mail inválido';
    }
    
    if (formData.name && !validators.minLength(formData.name, 2)) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const subscriptionData = {
        email: formatters.cleanString(formData.email),
        name: formData.name ? formatters.cleanString(formData.name) : null,
        interests: formData.interests
      };
      
      await subscribe(subscriptionData);
      
      // Success
      setIsSuccess(true);
      
      // Reset form
      setFormData({
        email: '',
        name: '',
        interests: []
      });
      setValidationErrors({});
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
    }
  };

  if (isSuccess) {
    return (
      <div className={`newsletter-success ${inline ? 'inline' : ''}`}>
        <CheckCircle size={48} style={{ color: 'var(--brand-primary)', marginBottom: '16px' }} />
        <h3 className="heading-2">Inscrição Realizada!</h3>
        <p className="body-medium" style={{ marginTop: '8px' }}>
          Obrigado por se inscrever! Você receberá conteúdos exclusivos em breve.
        </p>
      </div>
    );
  }

  return (
    <div className={`newsletter-signup ${inline ? 'inline' : ''}`}>
      <div className="newsletter-header">
        <Mail size={32} style={{ color: 'var(--brand-primary)' }} />
        <h3 className="heading-2">Newsletter ALG Tech</h3>
        <p className="body-medium">
          Receba conteúdos exclusivos sobre tecnologia, segurança e inovação
        </p>
      </div>

      <form onSubmit={handleSubmit} className="newsletter-form">
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
          <label htmlFor="newsletter-email" className="form-label">E-mail *</label>
          <input
            type="email"
            id="newsletter-email"
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
          <label htmlFor="newsletter-name" className="form-label">Nome (opcional)</label>
          <input
            type="text"
            id="newsletter-name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.name ? 'error' : ''}`}
            placeholder="Seu nome"
          />
          {validationErrors.name && (
            <span className="field-error">{validationErrors.name}</span>
          )}
        </div>

        {!inline && (
          <div className="form-group">
            <label className="form-label">Interesses (opcional)</label>
            <div className="interests-grid">
              {interestOptions.map((interest) => (
                <label key={interest} className="interest-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                  />
                  <span className="checkmark"></span>
                  {interest}
                </label>
              ))}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="btn-primary newsletter-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Inscrevendo..." : "Inscrever-se"}
          {!isSubmitting && <Mail size={20} />}
        </button>

        <p className="newsletter-disclaimer">
          Ao se inscrever, você concorda em receber e-mails da ALG Soluções em Tecnologia. 
          Você pode cancelar a inscrição a qualquer momento.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSignup;
