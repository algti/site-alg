import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

const currentRoute = window.location.pathname.replace(/\/$/, "") || "/";

// Só hidrata se o HTML pré-renderizado for da mesma rota (ex.: um 404 servido com o HTML da home)
if (container.dataset.route === currentRoute) {
  hydrateRoot(container, app);
} else {
  container.innerHTML = "";
  createRoot(container).render(app);
}
