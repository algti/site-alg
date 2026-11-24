// SEO utilities for dynamic meta tags and structured data

export const seoConfig = {
  defaultMeta: {
    title: "ALG Soluções em Tecnologia | Consultoria em TI para PMEs",
    description: "Especialistas em consultoria de TI, desenvolvimento de software, infraestrutura de rede e segurança da informação para pequenas e médias empresas em Londrina-PR.",
    keywords: "consultoria TI, desenvolvimento software, infraestrutura rede, segurança informação, LGPD, help desk, Londrina, Paraná",
    author: "ALG Soluções em Tecnologia",
    robots: "index, follow",
    language: "pt-BR",
    revisitAfter: "7 days",
    distribution: "global",
    rating: "general"
  },
  
  company: {
    name: "ALG Soluções em Tecnologia",
    legalName: "ALG Soluções em Tecnologia LTDA",
    cnpj: "59.115.660/0001-60",
    description: "Empresa especializada em consultoria e soluções em tecnologia da informação para pequenas e médias empresas",
    url: "/",
    logo: "/assets/alg-logo.png",
    address: {
      street: "Rua Exemplo, 123",
      city: "Londrina",
      state: "Paraná", 
      postalCode: "86000-000",
      country: "Brasil"
    },
    contact: {
      phone: "+5543999625471",
      email: "contato@algti.com",
      whatsapp: "+5543999625471"
    },
    social: {
      instagram: "/instagram"
    },
    services: [
      "Consultoria em TI",
      "Desenvolvimento de Software",
      "Infraestrutura de Rede", 
      "Help Desk e Suporte",
      "Consultoria LGPD",
      "Câmeras de Segurança - CFTV",
      "Segurança da Informação"
    ],
    foundingDate: "2020-01-01",
    employees: "10-50"
  },

  pages: {
    home: {
      title: "ALG Soluções em Tecnologia | Consultoria em TI para PMEs",
      description: "Transforme seu negócio com nossas soluções em TI. Consultoria especializada, desenvolvimento de software e infraestrutura para empresas em Londrina-PR.",
      keywords: "consultoria TI, soluções tecnologia, desenvolvimento software, infraestrutura rede, Londrina",
      canonical: "/",
      type: "website"
    },
    
    about: {
      title: "Sobre a ALG | Nossa História e Expertise em TI",
      description: "Conheça a ALG Soluções em Tecnologia. Mais de 4 anos transformando empresas através da tecnologia com consultoria especializada e soluções inovadoras.",
      keywords: "sobre ALG, história empresa, expertise TI, consultoria tecnologia, equipe especializada",
      canonical: "/sobre",
      type: "website"
    },
    
    services: {
      title: "Serviços de TI | Consultoria e Soluções Tecnológicas - ALG",
      description: "Descubra nossos serviços: Consultoria em TI, Desenvolvimento de Software, Infraestrutura de Rede, Help Desk, LGPD, Câmeras de Segurança (CFTV) e Segurança da Informação.",
      keywords: "serviços TI, consultoria, desenvolvimento software, infraestrutura, help desk, LGPD, segurança informação",
      canonical: "/servicos", 
      type: "website"
    },
    
    contact: {
      title: "Contato | Fale com a ALG Soluções em Tecnologia",
      description: "Entre em contato conosco para consultoria em TI. Atendemos empresas em Londrina e região. Solicite seu orçamento personalizado.",
      keywords: "contato ALG, orçamento TI, consultoria Londrina, fale conosco, atendimento empresas",
      canonical: "/contato",
      type: "website"
    }
  }
};

// Update document meta tags
export const updateMetaTags = (pageConfig) => {
  const config = { ...seoConfig.defaultMeta, ...pageConfig };
  
  // Update title
  document.title = config.title;
  
  // Update or create meta tags
  const metaTags = [
    { name: 'description', content: config.description },
    { name: 'keywords', content: config.keywords },
    { name: 'author', content: config.author },
    { name: 'robots', content: config.robots },
    { name: 'language', content: config.language },
    { name: 'revisit-after', content: config.revisitAfter },
    { name: 'distribution', content: config.distribution },
    { name: 'rating', content: config.rating },
    
    // Open Graph tags
    { property: 'og:title', content: config.title },
    { property: 'og:description', content: config.description },
    { property: 'og:type', content: config.type || 'website' },
    { property: 'og:url', content: `${seoConfig.company.url}${config.canonical || ''}` },
    { property: 'og:image', content: seoConfig.company.logo },
    { property: 'og:site_name', content: seoConfig.company.name },
    { property: 'og:locale', content: 'pt_BR' },
    
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: config.title },
    { name: 'twitter:description', content: config.description },
    { name: 'twitter:image', content: seoConfig.company.logo },
    
    // Additional meta tags
    { name: 'theme-color', content: '#00ffd1' },
    { name: 'msapplication-TileColor', content: '#00ffd1' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
  ];
  
  metaTags.forEach(tag => {
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
  
  // Update canonical link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `${seoConfig.company.url}${config.canonical || ''}`);
};

// Generate JSON-LD structured data for local business
export const generateLocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${seoConfig.company.url}#organization`,
    "name": seoConfig.company.name,
    "legalName": seoConfig.company.legalName,
    "description": seoConfig.company.description,
    "url": seoConfig.company.url,
    "logo": {
      "@type": "ImageObject",
      "url": seoConfig.company.logo,
      "width": 300,
      "height": 100
    },
    "image": seoConfig.company.logo,
    "telephone": seoConfig.company.contact.phone,
    "email": seoConfig.company.contact.email,
    "foundingDate": seoConfig.company.foundingDate,
    "numberOfEmployees": seoConfig.company.employees,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": seoConfig.company.address.street,
      "addressLocality": seoConfig.company.address.city,
      "addressRegion": seoConfig.company.address.state,
      "postalCode": seoConfig.company.address.postalCode,
      "addressCountry": seoConfig.company.address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.3045,
      "longitude": -51.1696
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Londrina"
      },
      {
        "@type": "State", 
        "name": "Paraná"
      }
    ],
    "serviceType": seoConfig.company.services,
    "priceRange": "$$",
    "currenciesAccepted": "BRL",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer, PIX",
    "openingHours": "Mo-Fr 08:00-18:00",
    "sameAs": [
      seoConfig.company.social.linkedin,
      seoConfig.company.social.instagram, 
      seoConfig.company.social.facebook
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": seoConfig.company.contact.phone,
        "contactType": "customer service",
        "availableLanguage": "Portuguese"
      },
      {
        "@type": "ContactPoint",
        "telephone": seoConfig.company.contact.whatsapp,
        "contactType": "customer service",
        "availableLanguage": "Portuguese",
        "contactOption": "WhatsApp"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de TI",
      "itemListElement": seoConfig.company.services.map((service, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service
        }
      }))
    }
  };
  
  return schema;
};

// Generate organization schema
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${seoConfig.company.url}#organization`,
    "name": seoConfig.company.name,
    "legalName": seoConfig.company.legalName,
    "url": seoConfig.company.url,
    "logo": seoConfig.company.logo,
    "description": seoConfig.company.description,
    "telephone": seoConfig.company.contact.phone,
    "email": seoConfig.company.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": seoConfig.company.address.street,
      "addressLocality": seoConfig.company.address.city,
      "addressRegion": seoConfig.company.address.state,
      "postalCode": seoConfig.company.address.postalCode,
      "addressCountry": seoConfig.company.address.country
    },
    "sameAs": [
      seoConfig.company.social.linkedin,
      seoConfig.company.social.instagram,
      seoConfig.company.social.facebook
    ]
  };
};

// Generate website schema
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${seoConfig.company.url}#website`,
    "url": seoConfig.company.url,
    "name": seoConfig.company.name,
    "description": seoConfig.company.description,
    "publisher": {
      "@id": `${seoConfig.company.url}#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${seoConfig.company.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "pt-BR"
  };
};

// Inject structured data into page
export const injectStructuredData = (schemas) => {
  // Remove existing structured data
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());
  
  // Add new structured data
  schemas.forEach(schema => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  });
};

// Main SEO setup function
export const setupPageSEO = (pageKey) => {
  const pageConfig = seoConfig.pages[pageKey];
  
  if (pageConfig) {
    // Update meta tags
    updateMetaTags(pageConfig);
    
    // Add structured data
    const schemas = [
      generateLocalBusinessSchema(),
      generateOrganizationSchema(),
      generateWebsiteSchema()
    ];
    
    injectStructuredData(schemas);
  }
};
