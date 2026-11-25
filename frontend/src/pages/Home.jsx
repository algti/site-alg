import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Zap, Shield, Calculator, Cctv } from 'lucide-react';
import BudgetRequestForm from '../components/BudgetRequestForm';
import ClientCarousel from '../components/ClientCarousel';
import { useSEO } from '../hooks/useSEO';

const Home = () => {
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  
  // Setup SEO for home page
  useSEO('home');

  const services = [
    {
      icon: <Shield size={32} />,
      title: "Segurança & LGPD",
      description: "Proteja seus dados e esteja em conformidade com a Lei Geral de Proteção de Dados."
    },
    {
      icon: <Zap size={32} />,
      title: "Infraestrutura de TI",
      description: "Servidores, redes, cabeamento estruturado e telefonia IP para sua empresa."
    },
    {
      icon: <Users size={32} />,
      title: "Suporte Especializado",
      description: "Help desk dedicado e treinamentos para sua equipe dominar as ferramentas."
    },
    {
      icon: <Cctv size={32} />,
      title: "Câmeras de Segurança - CFTV",
      description: "Videomonitoramento com instalação, manutenção e acesso remoto às imagens para proteger sua empresa."
    }
  ];

  const benefits = [
    "Redução de custos operacionais em até 40%",
    "Aumento da produtividade da equipe",
    "Segurança avançada contra ameaças",
    "Suporte técnico 24/7 disponível",
    "Conformidade total com LGPD",
    "Infraestrutura escalável e moderna"
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="company-logo">
                <img
                  src="/assets/logo-alg-hero.webp"
                  alt="ALG Soluções em Tecnologia"
                  className="hero-logo"
                  width="1700"
                  height="956"
                  fetchPriority="high"
                />
              </div>
              <h1 className="display-large" style={{ marginBottom: "16px" }}>
                Soluções em{" "}
                <span style={{ color: "var(--brand-primary)" }}>Tecnologia</span>{" "}
                que Impulsionam seu Negócio
              </h1>
              <p className="body-large" style={{ marginTop: "0px", marginBottom: "40px" }}>
                Transformando seu negócio através da tecnologia. Consultoria especializada, 
                controle de infraestrutura computacional e suporte dedicado para acelerar 
                o seu crescimento tecnológico.
              </p>
              <div className="hero-cta">
                <button 
                  onClick={() => setShowBudgetForm(true)}
                  className="btn-primary"
                >
                  Solicitar Orçamento
                  <Calculator size={20} />
                </button>
                <Link to="/servicos" className="btn-secondary">
                  Conhecer Serviços
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview section">
        <div className="container">
          <div className="section-header">
            <h2 className="display-medium">Nossos Principais Serviços</h2>
            <p className="body-medium" style={{ marginTop: "24px" }}>
              Oferecemos soluções completas em tecnologia para modernizar e otimizar sua empresa
            </p>
          </div>
          
          <div className="grid" style={{ marginTop: "80px", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {services.map((service, index) => (
              <div key={index} className="service-card dark-hover dark-transition">
                <div className="service-icon" style={{ color: "var(--brand-primary)" }}>
                  {service.icon}
                </div>
                <h3 className="heading-2" style={{ margin: "24px 0 16px" }}>
                  {service.title}
                </h3>
                <p className="body-small">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="grid grid-2">
            <div>
              <h2 className="display-medium">
                Por que escolher a{" "}
                <span style={{ color: "var(--brand-primary)" }}>ALG</span>?
              </h2>
              <p className="body-medium" style={{ margin: "24px 0 40px" }}>
                Mais de 10 anos de experiência transformando empresas através da tecnologia. 
                Nossa abordagem personalizada garante resultados mensuráveis e duradouros.
              </p>
              
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <CheckCircle size={20} style={{ color: "var(--brand-primary)" }} />
                    <span className="body-small">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-number display-large" style={{ color: "var(--brand-primary)" }}>
                  98%
                </div>
                <div className="stat-label body-medium">Satisfação dos Clientes</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number display-large" style={{ color: "var(--brand-primary)" }}>
                  24/7
                </div>
                <div className="stat-label body-medium">Suporte Disponível</div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Clientes Section */}
        <ClientCarousel />

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-content">
            <h2 className="display-medium">
              Pronto para Transformar sua Empresa?
            </h2>
            <p className="body-large" style={{ margin: "24px 0 48px" }}>
              Deixe-nos mostrar como podemos acelerar o crescimento do seu negócio através da tecnologia.
            </p>
            <div className="cta-buttons">
              <button 
                onClick={() => setShowBudgetForm(true)}
                className="btn-primary"
              >
                Solicitar Orçamento
                <Calculator size={20} />
              </button>
              <div className="cta-info">
                <p className="body-small">
                  Orçamento personalizado • Resposta em até 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Request Modal */}
      {showBudgetForm && (
        <div className="modal-overlay" onClick={() => setShowBudgetForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <BudgetRequestForm 
              onClose={() => setShowBudgetForm(false)}
              onSuccess={() => {
                setShowBudgetForm(false);
                // Show success message or redirect
                alert('Orçamento solicitado com sucesso! Entraremos em contato em breve.');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;