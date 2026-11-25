import React from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

const PrivacyPolicy = () => {
  useSEO("privacy");

  return (
    <div className="legal-page section">
      <div className="container" style={{ maxWidth: "900px" }}>
        <h1 className="display-large">
          Política de <span style={{ color: "var(--brand-primary)" }}>Privacidade</span>
        </h1>
        <p className="body-small" style={{ margin: "16px 0 48px" }}>Última atualização: 24 de novembro de 2026</p>

        <div className="legal-content" style={{ display: "grid", gap: "32px" }}>
          <section>
            <h2 className="heading-2">1. Quem somos</h2>
            <p className="body-medium">
              Esta política descreve como a ALG Soluções em Tecnologia LTDA (CNPJ 59.115.660/0001-60), de Londrina - PR,
              trata dados pessoais coletados neste site, em conformidade com a Lei Geral de Proteção de Dados
              (Lei nº 13.709/2018 - LGPD). Para esta finalidade, a ALG atua como controladora dos dados.
            </p>
          </section>

          <section>
            <h2 className="heading-2">2. Dados que coletamos</h2>
            <ul className="features-list body-medium">
              <li>Dados informados nos formulários de contato e de orçamento: nome, e-mail, telefone, empresa, assunto, mensagem e informações do projeto.</li>
              <li>Dados técnicos de envio: endereço IP e navegador (user agent), usados para segurança e prevenção de abuso.</li>
              <li>Dados de navegação e uso do site (páginas visitadas, dispositivo), coletados por ferramenta de análise somente se você aceitar os cookies de análise.</li>
            </ul>
          </section>

          <section>
            <h2 className="heading-2">3. Para que usamos seus dados</h2>
            <ul className="features-list body-medium">
              <li>Responder às suas mensagens e elaborar propostas e orçamentos solicitados por você.</li>
              <li>Proteger o site contra spam e uso indevido.</li>
              <li>Entender como o site é utilizado, para melhorá-lo (apenas com o seu consentimento).</li>
            </ul>
            <p className="body-medium" style={{ marginTop: "12px" }}>
              As bases legais utilizadas são a execução de procedimentos preliminares a contrato a pedido do titular,
              o legítimo interesse (segurança) e o consentimento (análise de uso).
            </p>
          </section>

          <section>
            <h2 className="heading-2">4. Compartilhamento</h2>
            <p className="body-medium">
              Não vendemos seus dados. Podemos compartilhá-los com prestadores que viabilizam o serviço, como provedores de
              hospedagem, de envio de e-mail e de análise de uso (PostHog), e quando exigido por lei. Ao usar o botão de
              WhatsApp, a conversa passa a ser regida também pelos termos do WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="heading-2">5. Cookies</h2>
            <p className="body-medium">
              Usamos cookies e armazenamento local de análise somente após o seu aceite no aviso exibido no site.
              Você pode recusar, e o site continuará funcionando normalmente. Sua escolha fica guardada no seu navegador
              e pode ser alterada limpando os dados do site.
            </p>
          </section>

          <section>
            <h2 className="heading-2">6. Por quanto tempo guardamos</h2>
            <p className="body-medium">
              Mantemos os dados pelo tempo necessário para atender à sua solicitação e cumprir obrigações legais ou
              regulatórias. Depois disso, eles são excluídos ou anonimizados.
            </p>
          </section>

          <section>
            <h2 className="heading-2">7. Seus direitos</h2>
            <p className="body-medium">
              Nos termos do art. 18 da LGPD, você pode solicitar confirmação de tratamento, acesso, correção, anonimização,
              portabilidade, eliminação dos dados tratados com consentimento, informação sobre compartilhamento e a
              revogação do consentimento. Para exercer esses direitos, escreva para{" "}
              <a href="mailto:contato@algti.com" style={{ color: "var(--brand-primary)" }}>contato@algti.com</a>.
            </p>
          </section>

          <section>
            <h2 className="heading-2">8. Segurança</h2>
            <p className="body-medium">
              Adotamos medidas técnicas e administrativas para proteger os dados, como conexão criptografada (HTTPS),
              controle de acesso e limitação de envios para evitar abusos.
            </p>
          </section>

          <section>
            <h2 className="heading-2">9. Alterações</h2>
            <p className="body-medium">
              Podemos atualizar esta política. A data da última atualização estará sempre indicada no topo desta página.
              Veja também os nossos <Link to="/termos-uso" style={{ color: "var(--brand-primary)" }}>Termos de Uso</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
