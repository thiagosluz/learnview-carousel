
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface ProfessorSearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export const ProfessorSearch = ({ searchTerm, onSearch }: ProfessorSearchProps) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar professor por nome..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};
