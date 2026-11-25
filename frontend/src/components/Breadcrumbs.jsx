import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getServiceBySlug } from '../data/services';

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Define breadcrumb mappings
  const breadcrumbMap = {
    '/': { label: 'Home', icon: <Home size={16} /> },
    '/sobre': { label: 'Sobre', parent: '/' },
    '/servicos': { label: 'Serviços', parent: '/' },
    '/contato': { label: 'Contato', parent: '/' },
    '/politica-privacidade': { label: 'Política de Privacidade', parent: '/' },
    '/termos-uso': { label: 'Termos de Uso', parent: '/' }
  };

  // Generate breadcrumb trail
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ path: '/', ...breadcrumbMap['/'] }];

    if (pathSegments[0] === 'servicos' && pathSegments.length === 2) {
      const service = getServiceBySlug(pathSegments[1]);
      breadcrumbs.push({ path: '/servicos', ...breadcrumbMap['/servicos'] });
      if (service) breadcrumbs.push({ path: location.pathname, label: service.title });
    } else if (pathSegments.length > 0) {
      const currentPath = `/${pathSegments.join('/')}`;
      if (breadcrumbMap[currentPath]) {
        breadcrumbs.push({
          path: currentPath,
          ...breadcrumbMap[currentPath]
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav 
      className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800"
      aria-label="Breadcrumb"
    >
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  size={16} 
                  className="text-gray-500 mx-2" 
                />
              )}
              
              {index === breadcrumbs.length - 1 ? (
                // Current page - not clickable
                <span className="flex items-center text-brand-primary font-medium">
                  {crumb.icon && <span className="mr-1">{crumb.icon}</span>}
                  {crumb.label}
                </span>
              ) : (
                // Clickable breadcrumb
                <Link
                  to={crumb.path}
                  className="flex items-center text-gray-300 hover:text-brand-primary transition-colors duration-200"
                >
                  {crumb.icon && <span className="mr-1">{crumb.icon}</span>}
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
