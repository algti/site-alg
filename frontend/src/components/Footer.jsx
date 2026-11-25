import React from "react";
import { Link } from "react-router-dom";
import { Phone, Clock, MapPin, Instagram } from "lucide-react";
import { services } from "../data/services";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img 
              src="/assets/logo-alg.png"
              alt="ALG Soluções em Tecnologia"
              className="footer-logo"
              width="42"
              height="40"
              loading="lazy"
            />
            <p className="footer-description body-small">
              Soluções completas em tecnologia para pequenas e médias empresas. 
              Inovação, segurança e eficiência em cada projeto.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="heading-3 footer-title">Navegação</h3>
            <ul className="footer-links">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/sobre">Sobre</Link></li>
              <li><Link to="/servicos">Serviços</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="heading-3 footer-title">Serviços</h3>
            <ul className="footer-links">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/servicos/${service.slug}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="heading-3 footer-title">Contato</h3>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={16} />
                <span>+55 (43) 99962-5471</span>
              </div>
              <div className="contact-item">
                <Clock size={16} />
                <span>Segunda à Sexta, 8h às 18h (BRT)</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Londrina - Paraná</span>
              </div>
              <div className="contact-item">
                <Instagram size={16} />
                <a href="https://instagram.com/algti_" target="_blank" rel="noopener noreferrer">
                  @algti_
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p>CNPJ: 59.115.660/0001-60</p>
            <p suppressHydrationWarning>&copy; {currentYear} ALG Soluções em Tecnologia. Todos os direitos reservados.</p>
          </div>
          <div className="footer-policies">
            <Link to="/politica-privacidade">Política de Privacidade</Link>
            <Link to="/termos-uso">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;