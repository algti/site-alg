import React from "react";
import { Target, Eye, Heart, Award, Users, Clock } from "lucide-react";
import { useSEO } from '../hooks/useSEO';

const About = () => {
  // Setup SEO for about page
  useSEO('about');

  const values = [
    {
      icon: <Target size={32} />,
      title: "Excelência",
      description: "Buscamos sempre a perfeição em cada projeto, entregando soluções que superam expectativas."
    },
    {
      icon: <Eye size={32} />,
      title: "Inovação",
      description: "Utilizamos as tecnologias mais avançadas para manter nossos clientes à frente da concorrência."
    },
    {
      icon: <Heart size={32} />,
      title: "Comprometimento",
      description: "Cada cliente é único. Dedicamos tempo para entender suas necessidades específicas."
    },
    {
      icon: <Award size={32} />,
      title: "Qualidade",
      description: "Processos rigorosos de controle de qualidade garantem a confiabilidade de nossas soluções."
    }
  ];

  const milestones = [
    {
      year: "2015",
      title: "Fundação da ALG",
      description: "Início das atividades focado em suporte técnico para pequenas empresas"
    },
    {
      year: "2017",
      title: "Expansão dos Serviços",
      description: "Ampliação para consultoria em TI e desenvolvimento de soluções personalizadas"
    },
    {
      year: "2020",
      title: "Era Digital",
      description: "Especialização em LGPD e transformação digital durante a pandemia"
    },
    {
      year: "2025",
      title: "Crescimento Consolidado",
      description: "Melhoria contínua, incremento de novas especialidades e melhor análise do mercado"
    }
  ];

  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero section">
        <div className="container">
          <div className="hero-content">
            <h1 className="display-large">
              Sobre a{" "}
              <span style={{ color: "var(--brand-primary)" }}>ALG Soluções em Tecnologia</span>
            </h1>
            <p className="body-large" style={{ marginTop: "32px" }}>
              Há mais de uma década, transformamos o cenário de empresas através 
              da tecnologia, oferecendo soluções inovadoras e suporte especializado 
              para impulsionar o crescimento dos nossos clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="mvv-section section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="grid grid-3">
            <div className="mvv-item">
              <Target size={48} style={{ color: "var(--brand-primary)", marginBottom: "24px" }} />
              <h3 className="heading-2">Nossa Missão</h3>
              <p className="body-medium" style={{ marginTop: "16px" }}>
                Democratizar o acesso à tecnologia de qualidade, oferecendo soluções 
                eficientes e acessíveis que potencializam o crescimento de nossos clientes.
              </p>
            </div>
            
            <div className="mvv-item">
              <Eye size={48} style={{ color: "var(--brand-primary)", marginBottom: "24px" }} />
              <h3 className="heading-2">Nossa Visão</h3>
              <p className="body-medium" style={{ marginTop: "16px" }}>
                Visamos buscar o melhor ambiente tecnológico para a empresa, ou seja, 
                aquilo que realmente faz sentido no atual cenário corporativo.
              </p>
            </div>
            
            <div className="mvv-item">
              <Heart size={48} style={{ color: "var(--brand-primary)", marginBottom: "24px" }} />
              <h3 className="heading-2">Nossos Valores</h3>
              <p className="body-medium" style={{ marginTop: "16px" }}>
                Transparência, inovação, excelência no atendimento e compromisso 
                com o sucesso dos nossos clientes são os pilares que guiam 
                todas as nossas ações. Ser resolutivo com qualidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="values-section section">
        <div className="container">
          <div className="section-header">
            <h2 className="display-medium">Nossos Diferenciais</h2>
            <p className="body-medium" style={{ marginTop: "24px" }}>
              Trabalhamos com tecnologia, mas o nosso atedimento é humanizado.
            </p>
          </div>
          
          <div className="grid grid-2" style={{ marginTop: "80px" }}>
            {values.map((value, index) => (
              <div key={index} className="value-card dark-hover dark-transition">
                <div className="value-icon" style={{ color: "var(--brand-primary)" }}>
                  {value.icon}
                </div>
                <h3 className="heading-2" style={{ margin: "24px 0 16px" }}>
                  {value.title}
                </h3>
                <p className="body-small">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div className="section-header">
            <h2 className="display-medium">Nossa Trajetória</h2>
            <p className="body-medium" style={{ marginTop: "24px" }}>
              Uma década de crescimento e inovação constante
            </p>
          </div>
          
          <div className="timeline" style={{ marginTop: "80px" }}>
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-year">
                  <span className="heading-1" style={{ color: "var(--brand-primary)" }}>
                    {milestone.year}
                  </span>
                </div>
                <div className="timeline-content">
                  <h3 className="heading-2">{milestone.title}</h3>
                  <p className="body-medium" style={{ marginTop: "12px" }}>
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="team-stats section">
        <div className="container">
          <div className="grid grid-3">
            <div className="stat-card">
              <Users size={48} style={{ color: "var(--brand-primary)", marginBottom: "24px" }} />
              <div className="stat-number display-large" style={{ color: "var(--brand-primary)" }}>
                15+
              </div>
              <div className="stat-label heading-3">Especialistas / Parceiros</div>
              <p className="body-small" style={{ marginTop: "12px" }}>
                Profissionais certificados em diversas tecnologias
              </p>
            </div>
            
            <div className="stat-card">
              <Clock size={48} style={{ color: "var(--brand-primary)", marginBottom: "24px" }} />
              <div className="stat-number display-large" style={{ color: "var(--brand-primary)" }}>
                10+
              </div>
              <div className="stat-label heading-3">Anos de Experiência</div>
              <p className="body-small" style={{ marginTop: "12px" }}>
                Década de excelência em soluções tecnológicas
              </p>
            </div>
            
            <div className="stat-card">
              <Award size={48} style={{ color: "var(--brand-primary)", marginBottom: "24px" }} />
              <div className="stat-number display-large" style={{ color: "var(--brand-primary)" }}>
                100+
              </div>
              <div className="stat-label heading-3">Projetos Concluídos</div>
              <p className="body-small" style={{ marginTop: "12px" }}>
                Empresas transformadas pela tecnologia
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;