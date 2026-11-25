import React from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

const TermsOfUse = () => {
  useSEO("terms");

  return (
    <div className="legal-page section">
      <div className="container" style={{ maxWidth: "900px" }}>
        <h1 className="display-large">
          Termos de <span style={{ color: "var(--brand-primary)" }}>Uso</span>
        </h1>
        <p className="body-small" style={{ margin: "16px 0 48px" }}>Última atualização: 24 de novembro de 2026</p>

        <div className="legal-content" style={{ display: "grid", gap: "32px" }}>
          <section>
            <h2 className="heading-2">1. Aceitação</h2>
            <p className="body-medium">
              Ao acessar e utilizar este site, mantido pela ALG Soluções em Tecnologia LTDA, você concorda com estes
              Termos de Uso e com a nossa{" "}
              <Link to="/politica-privacidade" style={{ color: "var(--brand-primary)" }}>Política de Privacidade</Link>.
            </p>
          </section>

          <section>
            <h2 className="heading-2">2. Finalidade do site</h2>
            <p className="body-medium">
              O site tem caráter informativo e de contato comercial. As informações sobre serviços não constituem proposta
              vinculante; condições, prazos e valores são definidos em proposta ou contrato específico.
            </p>
          </section>

          <section>
            <h2 className="heading-2">3. Uso adequado</h2>
            <p className="body-medium">
              Você se compromete a fornecer informações verdadeiras nos formulários e a não utilizar o site para fins
              ilícitos, envio de spam, tentativas de acesso não autorizado ou qualquer ação que prejudique seu funcionamento.
            </p>
          </section>

          <section>
            <h2 className="heading-2">4. Propriedade intelectual</h2>
            <p className="body-medium">
              Textos, marcas, logotipos e demais conteúdos do site pertencem à ALG ou a seus respectivos titulares
              (como os logotipos de clientes exibidos com autorização) e não podem ser reproduzidos sem permissão.
            </p>
          </section>

          <section>
            <h2 className="heading-2">5. Links e serviços de terceiros</h2>
            <p className="body-medium">
              O site pode conter links para serviços de terceiros, como WhatsApp, Instagram e a Área do Cliente. A ALG não
              se responsabiliza pelo conteúdo ou pelas práticas de privacidade desses serviços.
            </p>
          </section>

          <section>
            <h2 className="heading-2">6. Limitação de responsabilidade</h2>
            <p className="body-medium">
              Empenhamo-nos para manter o site disponível e atualizado, mas não garantimos funcionamento ininterrupto nem
              ausência de erros.
            </p>
          </section>

          <section>
            <h2 className="heading-2">7. Legislação e foro</h2>
            <p className="body-medium">
              Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de Londrina - PR para
              dirimir eventuais controvérsias, ressalvados os direitos do consumidor.
            </p>
          </section>

          <section>
            <h2 className="heading-2">8. Contato</h2>
            <p className="body-medium">
              Dúvidas sobre estes termos:{" "}
              <a href="mailto:contato@algti.com" style={{ color: "var(--brand-primary)" }}>contato@algti.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
