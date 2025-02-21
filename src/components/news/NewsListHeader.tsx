
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const NewsListHeader = () => {
  return (
    <Link to="/news/new">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Nova Notícia
      </Button>
    </Link>
  );
};
