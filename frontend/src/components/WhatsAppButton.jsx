import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppButton = ({ 
  phone = "+5543999625471", 
  defaultMessage = "Olá! Gostaria de saber mais sobre os serviços da ALG Soluções em Tecnologia.",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState(defaultMessage);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(customMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleQuickMessage = (message) => {
    setCustomMessage(message);
  };

  const quickMessages = [
    "Olá! Gostaria de solicitar um orçamento.",
    "Preciso de suporte técnico urgente.",
    "Quero saber mais sobre consultoria em TI.",
    "Tenho interesse em soluções LGPD.",
    "Gostaria de agendar uma apresentação."
  ];

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="whatsapp-button-container">
        <button
          className="whatsapp-button"
          onClick={() => setIsOpen(true)}
          title="Falar no WhatsApp"
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      {/* WhatsApp Message Dialog */}
      {isOpen && (
        <div className="whatsapp-dialog-overlay" onClick={() => setIsOpen(false)}>
          <div className="whatsapp-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="whatsapp-dialog-header">
              <div className="whatsapp-header-info">
                <MessageCircle size={24} style={{ color: '#25D366' }} />
                <div>
                  <h3 className="heading-3">WhatsApp ALG Tech</h3>
                  <p className="body-small">Atendimento rápido e personalizado</p>
                </div>
              </div>
              <button 
                className="whatsapp-close"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="whatsapp-dialog-body">
              <div className="quick-messages">
                <p className="body-small" style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>
                  Mensagens rápidas:
                </p>
                {quickMessages.map((message, index) => (
                  <button
                    key={index}
                    className="quick-message-btn"
                    onClick={() => handleQuickMessage(message)}
                  >
                    {message}
                  </button>
                ))}
              </div>

              <div className="custom-message">
                <label htmlFor="whatsapp-message" className="form-label">
                  Ou escreva sua mensagem:
                </label>
                <textarea
                  id="whatsapp-message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  className="form-textarea"
                  placeholder="Digite sua mensagem..."
                />
              </div>
            </div>

            <div className="whatsapp-dialog-footer">
              <button
                className="btn-primary whatsapp-send"
                onClick={handleWhatsAppClick}
                disabled={!customMessage.trim()}
              >
                Enviar no WhatsApp
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .whatsapp-button-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .whatsapp-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #25D366;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
          transition: all 0.3s ease;
        }

        .whatsapp-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(37, 211, 102, 0.6);
        }

        .whatsapp-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          padding: 20px;
        }

        .whatsapp-dialog {
          background: var(--bg-primary);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          width: 100%;
          max-width: 480px;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .whatsapp-dialog-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .whatsapp-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .whatsapp-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .whatsapp-close:hover {
          background: var(--bg-secondary);
        }

        .whatsapp-dialog-body {
          padding: 20px;
          flex: 1;
          overflow-y: auto;
        }

        .quick-messages {
          margin-bottom: 24px;
        }

        .quick-message-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          margin-bottom: 8px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .quick-message-btn:hover {
          background: var(--brand-hover);
          border-color: var(--brand-primary);
        }

        .custom-message {
          margin-top: 24px;
        }

        .whatsapp-dialog-footer {
          padding: 20px;
          border-top: 1px solid var(--border-subtle);
        }

        .whatsapp-send {
          width: 100%;
          justify-content: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .whatsapp-dialog {
            margin: 0;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsAppButton;
