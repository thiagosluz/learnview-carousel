import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from '@/components/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { fetchProfessors, deleteProfessor } from '@/services';
import { Professor } from '@/types';

const ITEMS_PER_PAGE = 10;

const ProfessorList = () => {
  const { toast } = useToast();
  const [professorToDelete, setProfessorToDelete] = useState<Professor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(professors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProfessors = professors.slice(startIndex, endIndex);

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Professores</h1>
          <Link to="/professors/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Professor
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProfessors.map((professor) => (
                <TableRow key={professor.id}>
                  <TableCell className="flex items-center gap-2">
                    {professor.photo_url ? (
                      <img 
                        src={professor.photo_url} 
                        alt={professor.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                          {professor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {professor.name}
                  </TableCell>
                  <TableCell>{professor.email}</TableCell>
                  <TableCell>{professor.phone}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/professors/edit/${professor.id}`}>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setProfessorToDelete(professor)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o professor {professor.name}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setProfessorToDelete(null)}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfessorList;
