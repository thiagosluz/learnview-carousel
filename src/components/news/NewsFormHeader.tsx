
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NewsFormHeaderProps {
  isEditing: boolean;
}

export const NewsFormHeader = ({ isEditing }: NewsFormHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Link to="/news">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <h1 className="text-2xl font-bold">
        {isEditing ? 'Editar Notícia' : 'Nova Notícia'}
      </h1>
    </div>
  );
};
