import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Início", path: "/" },
    { name: "Sobre", path: "/sobre" },
    { name: "Serviços", path: "/servicos" },
    { name: "Contato", path: "/contato" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_e294eb1f-956e-46eb-84e7-e7ed4e41ea2c/artifacts/xm3f1n6k_Logo%20ALG.png" 
              alt="ALG Soluções em Tecnologia" 
              className="logo-img"
            />
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="https://ticket.algti.com"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link client-area"
              onClick={() => setIsMenuOpen(false)}
            >
              Área do Cliente
            </a>
          </nav>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;