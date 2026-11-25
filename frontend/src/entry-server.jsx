import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { services } from "./data/services";

export { buildHeadHtml } from "./utils/seo";

export const routes = [
  "/",
  "/sobre",
  "/servicos",
  ...services.map((s) => `/servicos/${s.slug}`),
  "/contato",
  "/politica-privacidade",
  "/termos-uso"
];

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
