import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Trash2, Plus, Search, Filter, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import AdminLayout from '@/components/AdminLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

const LABORATORIOS = [
  'Laboratório 01',
  'Laboratório 02',
  'Laboratório 03',
  'Laboratório 04',
  'TADS 01',
  'TADS 02',
  'TADS 03',
  'REDES',
  'MSI 01',
  'MSI 02'
];

const ClassList = () => {
  const { toast } = useToast();
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const [dayFilter, setDayFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('');
  const [professorFilter, setProfessorFilter] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [labFilter, setLabFilter] = useState<string[]>([]);

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

  const filteredClasses = classes.filter(class_ => {
    const matchesDay = dayFilter === 'all' || DIAS_SEMANA[class_.day_of_week].toLowerCase().includes(dayFilter.toLowerCase());
    const matchesTime = !timeFilter || 
      class_.start_time.includes(timeFilter) || 
      class_.end_time.includes(timeFilter);
    const matchesProfessor = !professorFilter || 
      class_.professor.name.toLowerCase().includes(professorFilter.toLowerCase());
    const matchesSubject = !subjectFilter || 
      class_.subject.toLowerCase().includes(subjectFilter.toLowerCase());
    const matchesLab = labFilter.length === 0 || labFilter.includes(class_.lab);

    return matchesDay && matchesTime && matchesProfessor && matchesSubject && matchesLab;
  });

  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentClasses = filteredClasses.slice(startIndex, endIndex);

  const handleFilterChange = (value: string | string[], setFilter: (value: any) => void) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setDayFilter('all');
    setTimeFilter('');
    setProfessorFilter('');
    setSubjectFilter('');
    setLabFilter([]);
    setCurrentPage(1);
  };

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
      currentClasses.forEach(c => newSelected.delete(c.id));
    } else {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <Select
              value={dayFilter}
              onValueChange={(value) => handleFilterChange(value, setDayFilter)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dia da semana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os dias</SelectItem>
                {DIAS_SEMANA.map((dia, index) => (
                  <SelectItem key={index} value={dia}>{dia}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Input
              placeholder="Filtrar por horário..."
              value={timeFilter}
              onChange={(e) => handleFilterChange(e.target.value, setTimeFilter)}
              className="w-full"
            />
          </div>

          <div className="relative">
            <Input
              placeholder="Filtrar por professor..."
              value={professorFilter}
              onChange={(e) => handleFilterChange(e.target.value, setProfessorFilter)}
              className="w-full"
            />
          </div>

          <div className="relative">
            <Input
              placeholder="Filtrar por disciplina..."
              value={subjectFilter}
              onChange={(e) => handleFilterChange(e.target.value, setSubjectFilter)}
              className="w-full"
            />
          </div>

          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    labFilter.length > 0 && "text-zinc-900"
                  )}
                >
                  {labFilter.length === 0
                    ? "Selecionar laboratórios"
                    : `${labFilter.length} selecionado${labFilter.length === 1 ? '' : 's'}`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white shadow-md border border-gray-200">
                <Command className="bg-white">
                  <CommandInput placeholder="Buscar laboratório..." className="border-0" />
                  <CommandEmpty className="py-2 text-center text-sm text-gray-600">Nenhum laboratório encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                    {LABORATORIOS.map((lab) => (
                      <CommandItem
                        key={lab}
                        onSelect={() => {
                          const newValue = labFilter.includes(lab)
                            ? labFilter.filter((l) => l !== lab)
                            : [...labFilter, lab];
                          handleFilterChange(newValue, setLabFilter);
                        }}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        <Checkbox
                          checked={labFilter.includes(lab)}
                          className="mr-2"
                        />
                        {lab}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {(dayFilter !== 'all' || timeFilter || professorFilter || subjectFilter || labFilter.length > 0) && (
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="text-sm"
            >
              <Filter className="mr-2 h-4 w-4" />
              Limpar filtros
            </Button>
          </div>
        )}

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
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                      isDisabled={currentPage === 1}
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
                      isDisabled={currentPage === totalPages}
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

export default ClassList;
