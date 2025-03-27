
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from '@/components/AdminLayout';
import { fetchAllClasses, deleteClass } from '@/services';
import { Class } from '@/types';
import { ClassListHeader } from '@/components/class/ClassListHeader';
import { ClassListFilters, DIAS_SEMANA } from '@/components/class/ClassListFilters';
import { ClassTable } from '@/components/class/ClassTable';
import { ClassPagination } from '@/components/class/ClassPagination';

const ITEMS_PER_PAGE = 10;

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

  const hasActiveFilters = dayFilter !== 'all' || timeFilter || professorFilter || subjectFilter || labFilter.length > 0;

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <ClassListHeader 
          selectedCount={selectedClasses.size} 
          isDeleting={isDeleting} 
          onDeleteSelected={handleDeleteSelected} 
        />

        <ClassListFilters 
          dayFilter={dayFilter}
          timeFilter={timeFilter}
          professorFilter={professorFilter}
          subjectFilter={subjectFilter}
          labFilter={labFilter}
          onFilterChange={handleFilterChange}
          setDayFilter={setDayFilter}
          setTimeFilter={setTimeFilter}
          setProfessorFilter={setProfessorFilter}
          setSubjectFilter={setSubjectFilter}
          setLabFilter={setLabFilter}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="bg-white rounded-lg shadow">
          <ClassTable 
            classes={currentClasses}
            selectedClasses={selectedClasses}
            toggleClassSelection={toggleClassSelection}
            toggleAllCurrentPage={toggleAllCurrentPage}
            setClassToDelete={setClassToDelete}
            handleDelete={handleDelete}
          />

          <ClassPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClassList;
