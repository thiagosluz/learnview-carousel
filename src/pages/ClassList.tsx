
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
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
import { fetchAllClasses, deleteClass } from '@/services';
import { Class } from '@/types';

const ITEMS_PER_PAGE = 10;
const DIAS_SEMANA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

const ClassList = () => {
  const { toast } = useToast();
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: classes = [], isLoading, refetch } = useQuery<Class[]>({
    queryKey: ['classes'],
    queryFn: fetchAllClasses,
    meta: {
      errorMessage: 'Não foi possível carregar a lista de aulas',
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar aulas",
          description: error.message,
        });
      }
    }
  });

  const totalPages = Math.ceil(classes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentClasses = classes.slice(startIndex, endIndex);

  const toggleClassSelection = (classId: string) => {
    const newSelected = new Set(selectedClasses);
    if (newSelected.has(classId)) {
      newSelected.delete(classId);
    } else {
      newSelected.add(classId);
    }
    setSelectedClasses(newSelected);
  };

  const toggleAllCurrentPage = () => {
    const newSelected = new Set(selectedClasses);
    const allSelected = currentClasses.every(c => selectedClasses.has(c.id));
    
    if (allSelected) {
      // Remove todas as seleções da página atual
      currentClasses.forEach(c => newSelected.delete(c.id));
    } else {
      // Adiciona todas as aulas da página atual
      currentClasses.forEach(c => newSelected.add(c.id));
    }
    
    setSelectedClasses(newSelected);
  };

  const handleDelete = async () => {
    if (classToDelete) {
      try {
        await deleteClass(classToDelete.id);
        toast({
          title: "Aula excluída",
          description: "A aula foi excluída com sucesso.",
        });
        refetch();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao excluir aula",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao excluir a aula",
        });
      } finally {
        setClassToDelete(null);
      }
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      const deletePromises = Array.from(selectedClasses).map(id => deleteClass(id));
      await Promise.all(deletePromises);
      toast({
        title: "Aulas excluídas",
        description: `${selectedClasses.size} aulas foram excluídas com sucesso.`,
      });
      setSelectedClasses(new Set());
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir aulas",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao excluir as aulas",
      });
    } finally {
      setIsDeleting(false);
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
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Aulas</h1>
            {selectedClasses.size > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir selecionadas ({selectedClasses.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão em massa</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir {selectedClasses.size} aulas? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelected}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <Link to="/classes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Aula
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={currentClasses.length > 0 && currentClasses.every(c => selectedClasses.has(c.id))}
                    onCheckedChange={toggleAllCurrentPage}
                  />
                </TableHead>
                <TableHead>Dia</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Laboratório</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClasses.map((class_) => (
                <TableRow key={class_.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedClasses.has(class_.id)}
                      onCheckedChange={() => toggleClassSelection(class_.id)}
                    />
                  </TableCell>
                  <TableCell>{DIAS_SEMANA[class_.day_of_week]}</TableCell>
                  <TableCell>{`${class_.start_time} - ${class_.end_time}`}</TableCell>
                  <TableCell>{class_.professor.name}</TableCell>
                  <TableCell>{class_.subject}</TableCell>
                  <TableCell>{class_.lab}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/classes/edit/${class_.id}`}>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setClassToDelete(class_)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setClassToDelete(null)}>
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
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                    >
                      <PaginationPrevious />
                    </Button>
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
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <PaginationNext />
                    </Button>
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

export default ClassList;
