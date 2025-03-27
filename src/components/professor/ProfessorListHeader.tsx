
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export const ProfessorListHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Professores</h1>
      <Link to="/professors/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Professor
        </Button>
      </Link>
    </div>
  );
};
