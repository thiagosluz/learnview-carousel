
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from '@/components/AdminLayout';
import { ProfessorListHeader } from '@/components/professor/ProfessorListHeader';
import { ProfessorSearch } from '@/components/professor/ProfessorSearch';
import { ProfessorTable } from '@/components/professor/ProfessorTable';
import { ProfessorPagination } from '@/components/professor/ProfessorPagination';
import { fetchProfessors, deleteProfessor } from '@/services';
import { Professor } from '@/types';

const ITEMS_PER_PAGE = 10;

const ProfessorList = () => {
  const { toast } = useToast();
  const [professorToDelete, setProfessorToDelete] = useState<Professor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: professors = [], isLoading, refetch } = useQuery<Professor[]>({
    queryKey: ['professors'],
    queryFn: fetchProfessors,
    meta: {
      errorMessage: 'Não foi possível carregar a lista de professores',
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar professores",
          description: error.message,
        });
      }
    }
  });

  const filteredProfessors = professors.filter(professor =>
    professor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProfessors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProfessors = filteredProfessors.slice(startIndex, endIndex);

  const handleDelete = async () => {
    if (!professorToDelete) return;

    try {
      await deleteProfessor(professorToDelete.id);
      toast({
        title: "Professor excluído",
        description: "O professor foi excluído com sucesso.",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir professor",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao excluir o professor",
      });
    } finally {
      setProfessorToDelete(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-gray-600">Carregando...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <ProfessorListHeader />
        <ProfessorSearch 
          searchTerm={searchTerm} 
          onSearch={handleSearch} 
        />
        <ProfessorTable 
          professors={currentProfessors}
          onDeleteClick={setProfessorToDelete}
          onConfirmDelete={handleDelete}
          professorToDelete={professorToDelete}
          onCancelDelete={() => setProfessorToDelete(null)}
        />
        <ProfessorPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminLayout>
  );
};

export default ProfessorList;
