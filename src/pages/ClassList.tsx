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
import { fetchAllClasses, deleteClass } from '@/services';
import { Class } from '@/types';

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

  const handleDelete = async () => {
    if (!classToDelete) return;

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
          <h1 className="text-2xl font-bold">Aulas</h1>
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
                <TableHead>Dia</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Laboratório</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes?.map((class_) => (
                <TableRow key={class_.id}>
                  <TableCell>{DIAS_SEMANA[class_.day_of_week]}</TableCell>
                  <TableCell>{class_.start_time} - {class_.end_time}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {class_.professor.photo_url ? (
                      <img 
                        src={class_.professor.photo_url} 
                        alt={class_.professor.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                          {class_.professor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {class_.professor.name}
                  </TableCell>
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
        </div>
      </div>
    </div>
  );
};

export default ClassList;
