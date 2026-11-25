import React from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

const NotFound = () => {
  useSEO("notFound");

  return (
    <div className="section-large">
      <div className="container">
        <div className="hero-content" style={{ textAlign: "center" }}>
          <h1 className="display-large">
            Página <span style={{ color: "var(--brand-primary)" }}>não encontrada</span>
          </h1>
          <p className="body-large" style={{ margin: "32px 0 48px" }}>
            O endereço que você acessou não existe ou foi movido.
          </p>
          <Link to="/" className="btn-primary">Voltar ao início</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
