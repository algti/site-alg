import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import { MouseFollower } from "./components/MouseFollower";
import WhatsAppButton from "./components/WhatsAppButton";
import PageTransition from "./components/PageTransition";
import Breadcrumbs from "./components/Breadcrumbs";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MouseFollower />
        <Header />
        <Breadcrumbs />
        <main className="main-content">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/contato" element={<Contact />} />
            </Routes>
          </PageTransition>
        </main>
        <Footer />
        <WhatsAppButton sourcePage={window.location.pathname} />
        <ScrollToTop />
      </BrowserRouter>
    </div>
  );
}

export default App;