
import { School, Users, Newspaper, Home, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const NavMenu = () => {
  const location = useLocation();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const links = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/professors', icon: Users, label: 'Professores' },
    { path: '/classes', icon: School, label: 'Aulas' },
    { path: '/news', icon: Newspaper, label: 'Notícias' },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar sair",
      });
    }
  };

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
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-600 hover:text-primary"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default NavMenu;
