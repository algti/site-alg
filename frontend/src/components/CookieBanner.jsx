import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsent, setConsent, initAnalytics } from "../utils/analytics";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent === "accepted") initAnalytics();
    else if (!consent) setVisible(true);
  }, []);

  const choose = (value) => {
    setConsent(value);
    setVisible(false);
    if (value === "accepted") initAnalytics();
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <p className="body-small">
        Usamos cookies de análise para entender como o site é utilizado e melhorá-lo. Eles só são ativados com o seu
        aceite. Saiba mais na{" "}
        <Link to="/politica-privacidade">Política de Privacidade</Link>.
      </p>
      <div className="cookie-banner-actions">
        <button type="button" className="btn-secondary" onClick={() => choose("rejected")}>
          Recusar
        </button>
        <button type="button" className="btn-primary" onClick={() => choose("accepted")}>
          Aceitar
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
