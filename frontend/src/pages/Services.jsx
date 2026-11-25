import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSEO } from '../hooks/useSEO';
import { services } from '../data/services';

const Services = () => {
  useSEO('services');

  return (
    <div className="services">
      {/* Hero Section */}
      <section className="services-hero section">
        <div className="container">
          <div className="hero-content">
            <h1 className="display-large">
              Nossos{" "}
              <span style={{ color: "var(--brand-primary)" }}>Serviços</span>
            </h1>
            <p className="body-large" style={{ marginTop: "32px", maxWidth: "800px" }}>
              Oferecemos um portfólio completo de soluções tecnológicas para 
              sua empresa. Do planejamento estratégico ao suporte técnico diário,
              cuidamos de toda a infraestrutura de TI do seu negócio.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid section">
        <div className="container">
          <div className="grid grid-2" style={{ gap: "60px" }}>
            {services.map((service) => (
              <div key={service.slug} className="service-detailed-card dark-hover dark-transition">
                <div className="service-header">
                  <div className="service-icon" style={{ color: "var(--brand-primary)" }}>
                    <service.icon size={48} />
                  </div>
                  <div className="service-title-area">
                    <h3 className="heading-2">{service.title}</h3>
                    <p className="body-medium" style={{ marginTop: "12px" }}>
                      {service.description}
                    </p>
                  </div>
                </div>
                
                <div className="service-features">
                  <h4 className="heading-3" style={{ marginBottom: "16px" }}>
                    Principais recursos:
                  </h4>
                  <ul className="features-list">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="feature-item body-small">
                        <span className="feature-bullet" style={{ color: "var(--brand-primary)" }}>
                          •
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/servicos/${service.slug}`}
                  className="service-more-link"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "24px", color: "var(--brand-primary)" }}
                >
                  Saiba mais <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="cta-content">
            <h2 className="display-medium">
              Precisa de uma Solução Personalizada?
            </h2>
            <p className="body-large" style={{ margin: "24px 0 48px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
              Estamos prontos para analisar suas necessidades 
              e criar uma solução sob medida para sua empresa.
            </p>
            <div className="cta-buttons">
              <Link to="/contato" className="btn-primary">
                Solicitar Orçamento
              </Link>
              <a href="tel:+5543999625471" className="btn-secondary">
                Ligar Agora: (43) 99962-5471
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section section">
        <div className="container">
          <div className="section-header">
            <h2 className="display-medium">Como Trabalhamos</h2>
            <p className="body-medium" style={{ marginTop: "24px" }}>
              Nossa metodologia comprovada garante resultados eficientes e duradouros
            </p>
          </div>
          
          <div className="process-steps" style={{ marginTop: "80px" }}>
            <div className="process-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3 className="heading-2">Diagnóstico</h3>
                <p className="body-medium">
                  Análise completa da sua infraestrutura atual e identificação de oportunidades.
                </p>
              </div>
            </div>
            
            <div className="process-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3 className="heading-2">Planejamento</h3>
                <p className="body-medium">
                  Desenvolvimento de estratégia personalizada com cronograma e orçamento detalhados.
                </p>
              </div>
            </div>
            
            <div className="process-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3 className="heading-2">Implementação</h3>
                <p className="body-medium">
                  Execução do projeto com acompanhamento constante e comunicação transparente.
                </p>
              </div>
            </div>
            
            <div className="process-step">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3 className="heading-2">Suporte Contínuo</h3>
                <p className="body-medium">
                  Monitoramento e suporte técnico para garantir performance ideal a longo prazo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;