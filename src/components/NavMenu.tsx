import { School, Users, Newspaper, Home, LogOut, QrCode, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const NavMenu = () => {
  const location = useLocation();
  const { isAuthenticated, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const publicLinks = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/horarios', icon: Calendar, label: 'Horários' },
  ];

  const privateLinks = [
    { path: '/professors', icon: Users, label: 'Professores' },
    { path: '/classes', icon: School, label: 'Aulas' },
    { path: '/news', icon: Newspaper, label: 'Notícias' },
    { path: '/links', icon: QrCode, label: 'Links QR' },
  ];

  const links = isAuthenticated ? [...publicLinks, ...privateLinks] : publicLinks;

  return (
    <div className="bg-white shadow-md mb-6">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2">
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
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="text-gray-600 hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavMenu;
