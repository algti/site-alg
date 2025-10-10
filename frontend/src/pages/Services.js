import React from "react";
import { 
  Brain, 
  Code, 
  Headphones, 
  Network, 
  Wrench, 
  Download, 
  Settings, 
  GraduationCap, 
  Laptop, 
  Shield 
} from "lucide-react";
import { useSEO } from '../hooks/useSEO';

const Services = () => {
  // Setup SEO for services page
  useSEO('services');
  const services = [
    {
      icon: <Brain size={48} />,
      title: "Consultoria em TI",
      description: "Análise completa da sua infraestrutura tecnológica com recomendações estratégicas para otimização de processos e redução de custos.",
      features: [
        "Auditoria completa de TI",
        "Planejamento estratégico tecnológico",
        "Análise de ROI em investimentos",
        "Roadmap de modernização"
      ]
    },
    {
      icon: <Code size={48} />,
      title: "Soluções em Software",
      description: "Desenvolvimento e implementação de sistemas personalizados que atendem às necessidades específicas do seu negócio.",
      features: [
        "Sistemas web personalizados",
        "Integração entre sistemas",
        "Automação de processos",
        "APIs e integrações"
      ]
    },
    {
      icon: <Headphones size={48} />,
      title: "Help Desk",
      description: "Suporte técnico especializado para manter sua equipe produtiva e resolver problemas tecnológicos rapidamente.",
      features: [
        "Suporte remoto e presencial",
        "Atendimento multicanal",
        "SLA garantido",
        "Relatórios de atendimento"
      ]
    },
    {
      icon: <Network size={48} />,
      title: "Infraestrutura de Rede",
      description: "Projeto e implementação de redes robustas, seguras e escaláveis para suportar o crescimento da sua empresa.",
      features: [
        "Cabeamento estruturado",
        "Configuração de servidores",
        "Redes Wi-Fi empresariais",
        "Telefonia IP",
        "Switches e roteadores",
        "Segurança de rede"
      ]
    },
    {
      icon: <Wrench size={48} />,
      title: "Manutenção de Hardware",
      description: "Manutenção preventiva e corretiva de equipamentos para garantir máxima disponibilidade e performance.",
      features: [
        "Computadores e notebooks",
        "Monitores e periféricos",
        "Impressoras e multifuncionais",
        "Manutenção preventiva",
        "Diagnóstico avançado"
      ]
    },
    {
      icon: <Download size={48} />,
      title: "Instalação de Software",
      description: "Instalação, configuração e otimização de softwares empresariais para máxima eficiência operacional.",
      features: [
        "Softwares empresariais",
        "Licenciamento correto",
        "Configuração personalizada",
        "Treinamento de uso"
      ]
    },
    {
      icon: <Settings size={48} />,
      title: "Administração de TI",
      description: "Gestão completa do ambiente tecnológico da sua empresa, garantindo estabilidade e segurança.",
      features: [
        "Monitoramento 24/7",
        "Backup e recovery",
        "Atualizações de segurança",
        "Gestão de usuários"
      ]
    },
    {
      icon: <GraduationCap size={48} />,
      title: "Treinamentos",
      description: "Capacitação da sua equipe em ferramentas tecnológicas e melhores práticas de segurança digital.",
      features: [
        "Treinamento em ferramentas",
        "Conscientização em segurança",
        "Melhores práticas de TI",
        "Combate à engenharia social"
      ]
    },
    {
      icon: <Shield size={48} />,
      title: "Consultoria LGPD",
      description: "Adequação completa à Lei Geral de Proteção de Dados, garantindo conformidade e evitando multas.",
      features: [
        "Mapeamento de dados",
        "Políticas de privacidade",
        "Treinamento de equipes",
        "Monitoramento contínuo"
      ]
    }
  ];

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
            {services.map((service, index) => (
              <div key={index} className="service-detailed-card dark-hover dark-transition">
                <div className="service-header">
                  <div className="service-icon" style={{ color: "var(--brand-primary)" }}>
                    {service.icon}
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
              <a href="/contato" className="btn-primary">
                Solicitar Orçamento
              </a>
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