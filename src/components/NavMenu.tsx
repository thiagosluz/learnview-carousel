
import { School, Users, Newspaper, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavMenu = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const links = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/professors', icon: Users, label: 'Professores' },
    { path: '/classes', icon: School, label: 'Aulas' },
    { path: '/news', icon: Newspaper, label: 'Notícias' },
  ];

  return (
    <div className="bg-white shadow-md mb-6">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2">
          {links.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-3 py-4 hover:bg-gray-50 transition-colors ${
                isActive(path)
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default NavMenu;
