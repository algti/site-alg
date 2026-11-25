import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import NotFound from "./pages/NotFound";
import { MouseFollower } from "./components/MouseFollower";
import WhatsAppButton from "./components/WhatsAppButton";
import PageTransition from "./components/PageTransition";
import Breadcrumbs from "./components/Breadcrumbs";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/CookieBanner";

function App() {
  return (
    <div className="App">
      <MouseFollower />
      <Header />
      <Breadcrumbs />
      <main className="main-content">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/servicos/:slug" element={<ServiceDetail />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos-uso" element={<TermsOfUse />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
}

export default App;
