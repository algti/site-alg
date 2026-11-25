// SEO utilities for dynamic meta tags and structured data
import { services } from '../data/services';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://algti.com.br').replace(/\/$/, '');

export const seoConfig = {
  defaultMeta: {
    title: "ALG Soluções em Tecnologia | Consultoria em TI para PMEs",
    description: "Especialistas em consultoria de TI, desenvolvimento de software, infraestrutura de rede e segurança da informação para pequenas e médias empresas em Londrina-PR.",
    keywords: "consultoria TI, desenvolvimento software, infraestrutura rede, segurança informação, LGPD, help desk, CFTV, Londrina, Paraná",
    author: "ALG Soluções em Tecnologia",
    robots: "index, follow",
    language: "pt-BR"
  },

  company: {
    name: "ALG Soluções em Tecnologia",
    legalName: "ALG Soluções em Tecnologia LTDA",
    description: "Empresa especializada em consultoria e soluções em tecnologia da informação para pequenas e médias empresas",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo-alg.png`,
    ogImage: `${SITE_URL}/assets/og-image.png`,
    address: {
      city: "Londrina",
      state: "Paraná",
      country: "BR"
    },
    contact: {
      phone: "+5543999625471",
      email: "contato@algti.com",
      whatsapp: "+5543999625471"
    },
    social: {
      instagram: "https://instagram.com/algti_"
    },
    services: services.map((s) => s.title)
  },

  pages: {
    home: {
      title: "ALG Soluções em Tecnologia | Consultoria em TI para PMEs",
      description: "Transforme seu negócio com nossas soluções em TI. Consultoria especializada, desenvolvimento de software, infraestrutura e câmeras de segurança para empresas em Londrina-PR.",
      keywords: "consultoria TI, soluções tecnologia, desenvolvimento software, infraestrutura rede, CFTV, Londrina",
      canonical: "/",
      type: "website"
    },

    about: {
      title: "Sobre a ALG | Nossa História e Expertise em TI",
      description: "Conheça a ALG Soluções em Tecnologia. Transformamos empresas através da tecnologia com consultoria especializada e soluções inovadoras.",
      keywords: "sobre ALG, história empresa, expertise TI, consultoria tecnologia, equipe especializada",
      canonical: "/sobre",
      type: "website"
    },

    services: {
      title: "Serviços de TI | Consultoria e Soluções Tecnológicas - ALG",
      description: "Descubra nossos serviços: Consultoria em TI, Desenvolvimento de Software, Infraestrutura de Rede, Help Desk, LGPD, Câmeras de Segurança (CFTV) e Segurança da Informação.",
      keywords: "serviços TI, consultoria, desenvolvimento software, infraestrutura, help desk, LGPD, CFTV, segurança informação",
      canonical: "/servicos",
      type: "website"
    },

    contact: {
      title: "Contato | Fale com a ALG Soluções em Tecnologia",
      description: "Entre em contato conosco para consultoria em TI. Atendemos empresas em Londrina e região. Solicite seu orçamento personalizado.",
      keywords: "contato ALG, orçamento TI, consultoria Londrina, fale conosco, atendimento empresas",
      canonical: "/contato",
      type: "website"
    },

    privacy: {
      title: "Política de Privacidade | ALG Soluções em Tecnologia",
      description: "Saiba como a ALG Soluções em Tecnologia coleta, utiliza e protege seus dados pessoais, em conformidade com a LGPD.",
      canonical: "/politica-privacidade",
      type: "website"
    },

    terms: {
      title: "Termos de Uso | ALG Soluções em Tecnologia",
      description: "Termos e condições de uso do site da ALG Soluções em Tecnologia.",
      canonical: "/termos-uso",
      type: "website"
    },

    notFound: {
      title: "Página não encontrada | ALG Soluções em Tecnologia",
      description: "A página que você procura não foi encontrada.",
      canonical: "/",
      robots: "noindex, follow",
      type: "website"
    }
  }
};

export const getServiceSeo = (service) => ({
  title: `${service.title} em Londrina | ALG Soluções em Tecnologia`,
  description: service.description,
  keywords: `${service.title}, ${service.features.slice(0, 3).join(', ')}, Londrina`,
  canonical: `/servicos/${service.slug}`,
  type: "website"
});

// Resolve a configuração de SEO a partir do caminho (usado na pré-renderização)
export const getSeoForPath = (path) => {
  const clean = path.replace(/\/$/, '') || '/';
  const map = {
    '/': seoConfig.pages.home,
    '/sobre': seoConfig.pages.about,
    '/servicos': seoConfig.pages.services,
    '/contato': seoConfig.pages.contact,
    '/politica-privacidade': seoConfig.pages.privacy,
    '/termos-uso': seoConfig.pages.terms
  };
  if (map[clean]) return map[clean];
  const match = clean.match(/^\/servicos\/([^/]+)$/);
  const service = match && services.find((s) => s.slug === match[1]);
  return service ? getServiceSeo(service) : seoConfig.pages.notFound;
};

const absolute = (path = '') => `${seoConfig.company.url}${path === '/' ? '/' : path}`;

const buildMetaList = (pageConfig) => {
  const config = { ...seoConfig.defaultMeta, ...pageConfig };
  const url = absolute(config.canonical || '/');
  const list = [
    { name: 'description', content: config.description },
    { name: 'keywords', content: config.keywords },
    { name: 'author', content: config.author },
    { name: 'robots', content: config.robots },
    { property: 'og:title', content: config.title },
    { property: 'og:description', content: config.description },
    { property: 'og:type', content: config.type || 'website' },
    { property: 'og:url', content: url },
    { property: 'og:image', content: seoConfig.company.ogImage },
    { property: 'og:site_name', content: seoConfig.company.name },
    { property: 'og:locale', content: 'pt_BR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: config.title },
    { name: 'twitter:description', content: config.description },
    { name: 'twitter:image', content: seoConfig.company.ogImage }
  ].filter((t) => t.content);
  return { config, url, list };
};

// Update document meta tags (navegação no cliente)
export const updateMetaTags = (pageConfig) => {
  const { config, url, list } = buildMetaList(pageConfig);

  document.title = config.title;

  list.forEach((tag) => {
    const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
    let element = document.querySelector(selector);

    if (!element) {
      element = document.createElement('meta');
      if (tag.name) element.setAttribute('name', tag.name);
      if (tag.property) element.setAttribute('property', tag.property);
      document.head.appendChild(element);
    }

    element.setAttribute('content', tag.content);
  });

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
};

const sameAs = () => Object.values(seoConfig.company.social).filter((u) => /^https?:\/\//.test(u));

// Generate JSON-LD structured data for local business
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${seoConfig.company.url}/#organization`,
  "name": seoConfig.company.name,
  "legalName": seoConfig.company.legalName,
  "description": seoConfig.company.description,
  "url": seoConfig.company.url,
  "logo": seoConfig.company.logo,
  "image": seoConfig.company.ogImage,
  "telephone": seoConfig.company.contact.phone,
  "email": seoConfig.company.contact.email,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": seoConfig.company.address.city,
    "addressRegion": seoConfig.company.address.state,
    "addressCountry": seoConfig.company.address.country
  },
  "areaServed": [
    { "@type": "City", "name": "Londrina" },
    { "@type": "State", "name": "Paraná" }
  ],
  "openingHours": "Mo-Fr 08:00-18:00",
  "sameAs": sameAs(),
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": seoConfig.company.contact.phone,
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Serviços de TI",
    "itemListElement": seoConfig.company.services.map((service) => ({
      "@type": "Offer",
      "itemOffered": { "@type": "Service", "name": service }
    }))
  }
});

// Generate website schema
export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${seoConfig.company.url}/#website`,
  "url": seoConfig.company.url,
  "name": seoConfig.company.name,
  "description": seoConfig.company.description,
  "publisher": { "@id": `${seoConfig.company.url}/#organization` },
  "inLanguage": "pt-BR"
});

export const getSchemas = () => [generateLocalBusinessSchema(), generateWebsiteSchema()];

// Inject structured data into page
export const injectStructuredData = (schemas) => {
  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => script.remove());

  schemas.forEach((schema) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
};

// Main SEO setup function: aceita a chave de uma página ou um objeto de configuração
export const setupPageSEO = (pageKeyOrConfig) => {
  const pageConfig = typeof pageKeyOrConfig === 'string' ? seoConfig.pages[pageKeyOrConfig] : pageKeyOrConfig;
  if (!pageConfig) return;
  updateMetaTags(pageConfig);
  injectStructuredData(getSchemas());
};

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// HTML do <head> específico da rota (usado na pré-renderização)
export const buildHeadHtml = (path) => {
  const { config, url, list } = buildMetaList(getSeoForPath(path));
  const metas = list
    .map((t) => (t.name
      ? `<meta name="${t.name}" content="${esc(t.content)}" />`
      : `<meta property="${t.property}" content="${esc(t.content)}" />`))
    .join('\n    ');
  const ld = getSchemas()
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');
  return `<title>${esc(config.title)}</title>\n    ${metas}\n    <link rel="canonical" href="${esc(url)}" />\n    ${ld}`;
};
