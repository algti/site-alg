import React from 'react';

const ClientCarousel = () => {
  const clients = [
    {
      name: "Elo Energy Storage",
      logo: "/assets/logo-clientes/elo.png",
      width: 168,
      height: 96
    },
    {
      name: "VidaSeg",
      logo: "/assets/logo-clientes/vidaseg.png",
      width: 168,
      height: 96
    },
    {
      name: "Andrea Hotfix",
      logo: "/assets/logo-clientes/hotfix.png",
      width: 168,
      height: 96
    },
    {
      name: "Cemep",
      logo: "/assets/logo-clientes/cemep.png",
      width: 168,
      height: 96
    },
    {
      name: "Road Engenharia", 
      logo: "/assets/logo-clientes/road.png",
      width: 168,
      height: 96
    },
    {
      name: "Polim Agri",
      logo: "/assets/logo-clientes/polimagri.png",
      width: 168,
      height: 96
    },
    {
      name: "Deline Odontologia",
      logo: "/assets/logo-clientes/deline.png",
      width: 168,
      height: 96
    }
  ];

  return (
    <section className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Clientes que <span className="text-brand-primary">Confiam</span> na ALG
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Empresas de diversos segmentos já transformaram seus negócios com nossas soluções
          </p>
        </div>

        {/* Fixed height container to prevent layout shift */}
        <div className="relative h-28 overflow-hidden">
          <div className="client-carousel-track">
            {/* First set of logos */}
            <div className="client-carousel-set">
              {clients.map((client, index) => (
                <div 
                  key={`first-${index}`}
                  className="client-logo-item"
                  style={{ 
                    width: client.width,
                    height: client.height,
                    minWidth: client.width,
                    minHeight: client.height
                  }}
                >
                  <img src={client.logo} alt={`Logo ${client.name}`} className="client-logo" loading="eager" decoding="async" />
                </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="client-carousel-set">
              {clients.map((client, index) => (
                <div 
                  key={`second-${index}`}
                  className="client-logo-item"
                  style={{ 
                    width: client.width,
                    height: client.height,
                    minWidth: client.width,
                    minHeight: client.height
                  }}
                >
                  <img src={client.logo} alt={`Logo ${client.name}`} className="client-logo" loading="eager" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientCarousel;
