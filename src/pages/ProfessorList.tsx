import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import NavMenu from '@/components/NavMenu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const ProfessorList = () => {
  const { toast } = useToast();
  const [professorToDelete, setProfessorToDelete] = useState<Professor | null>(null);

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
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      <NavMenu />
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
                <TableHead>Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professors?.map((professor) => (
                <TableRow key={professor.id}>
                  <TableCell>
                    {professor.photo_url ? (
                      <img 
                        src={professor.photo_url} 
                        alt={professor.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                          {professor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{professor.name}</TableCell>
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
        </div>
      </div>
    </div>
  );
};

export default ProfessorList;
