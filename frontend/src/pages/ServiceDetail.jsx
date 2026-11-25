import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, MessageCircle } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { getServiceSeo } from "../utils/seo";
import { getServiceBySlug, services } from "../data/services";
import NotFound from "./NotFound";

const WHATSAPP_PHONE = "5543999625471";

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  useSEO(service ? getServiceSeo(service) : "notFound");

  if (!service) return <NotFound />;

  const Icon = service.icon;
  const others = services.filter((s) => s.slug !== service.slug);
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    `Olá! Gostaria de saber mais sobre o serviço de ${service.title}.`
  )}`;

  return (
    <div className="service-detail">
      <section className="services-hero section">
        <div className="container">
          <div className="hero-content">
            <Link to="/servicos" className="body-small" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--brand-primary)", marginBottom: "32px" }}>
              <ArrowLeft size={16} /> Todos os serviços
            </Link>
            <div style={{ color: "var(--brand-primary)", marginBottom: "24px", display: "flex", justifyContent: "center" }}>
              <Icon size={64} />
            </div>
            <h1 className="display-large">{service.title}</h1>
            <p className="body-large" style={{ margin: "32px auto 0", maxWidth: "800px" }}>
              {service.description}
            </p>
            <div className="hero-cta" style={{ marginTop: "40px" }}>
              <Link to={`/contato?assunto=${encodeURIComponent(service.title)}`} className="btn-primary">
                Solicitar Orçamento
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Falar no WhatsApp <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <h2 className="display-medium">O que está incluído</h2>
          <div className="grid grid-2" style={{ marginTop: "48px", gap: "24px" }}>
            {service.features.map((feature) => (
              <div key={feature} className="benefit-item">
                <CheckCircle size={20} style={{ color: "var(--brand-primary)", flexShrink: 0 }} />
                <span className="body-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="display-medium">Outros serviços</h2>
          <ul className="footer-links" style={{ marginTop: "32px", display: "grid", gap: "12px" }}>
            {others.map((s) => (
              <li key={s.slug}>
                <Link to={`/servicos/${s.slug}`} style={{ color: "var(--brand-primary)" }}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
