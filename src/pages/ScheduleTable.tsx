import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { fetchSchedule } from '@/services/schedule';
import { Class } from '@/types';
import { cn } from "@/lib/utils";
import NavMenu from '@/components/NavMenu';

const CURSOS = [
  { id: 'TADS', name: 'TADS - Tecnologia em Análise e Desenvolvimento de Sistemas' },
  { id: 'MSI', name: 'MSI - Manutenção e Suporte em Informática' },
  { id: 'Esp. IE', name: 'Especialização em Informática na Educação' },
];

const DIAS_SEMANA = [
  { id: 'all', name: 'TODOS' },
  { id: '1', name: 'SEG' },
  { id: '2', name: 'TER' },
  { id: '3', name: 'QUA' },
  { id: '4', name: 'QUI' },
  { id: '5', name: 'SEX' },
  { id: '6', name: 'SAB' },
];

const PERIODOS = [
  { id: 'manha', name: 'Manhã', horarios: ['07:00', '08:45'] },
  { id: 'tarde', name: 'Tarde', horarios: ['14:00', '15:45', '17:30'] },
  { id: 'noite', name: 'Noite', horarios: ['19:00', '20:45'] },
];

const getCurrentDayOfWeek = () => {
  const today = new Date();
  const day = today.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  
  // Se for domingo (0) ou sábado (6), retorna 'all'
  if (day === 0) return 'all';
  
  // Retorna o dia atual como string
  return day.toString();
};

const ScheduleTable = () => {
  const [selectedCurso, setSelectedCurso] = useState<string>('all');
  const [selectedDia, setSelectedDia] = useState<string>(getCurrentDayOfWeek());

  const { data: classes = [], isLoading } = useQuery<Class[]>({
    queryKey: ['schedule'],
    queryFn: fetchSchedule,
  });

  const filteredClasses = useMemo(() => {
    return classes.filter((aula) => {
      const matchesCurso = selectedCurso === 'all' || aula.course === selectedCurso;
      const matchesDia = selectedDia === 'all' || aula.day_of_week.toString() === selectedDia;
      return matchesCurso && matchesDia;
    });
  }, [classes, selectedCurso, selectedDia]);

  const groupedClasses = useMemo(() => {
    const grouped = PERIODOS.map(periodo => ({
      ...periodo,
      aulas: periodo.horarios.flatMap(horarioInicio => {
        return filteredClasses.filter(aula => {
          const aulaHora = parseInt(aula.start_time.split(':')[0]);
          const periodoHora = parseInt(horarioInicio.split(':')[0]);
          return aulaHora === periodoHora;
        });
      }),
    }));
    return grouped;
  }, [filteredClasses]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavMenu />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Horário de Aulas</h1>
        </div>

        <div className="space-y-6">
          <Select
            value={selectedCurso}
            onValueChange={setSelectedCurso}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Selecione o curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cursos</SelectItem>
              {CURSOS.map((curso) => (
                <SelectItem key={curso.id} value={curso.id}>
                  {curso.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-full overflow-x-auto scrollbar-none pb-2">
            <Tabs value={selectedDia} onValueChange={setSelectedDia} className="w-full">
              <TabsList className="inline-flex w-fit min-w-full justify-center rounded-md bg-muted p-1 text-muted-foreground">
                {DIAS_SEMANA.map((dia) => (
                  <TabsTrigger 
                    key={dia.id} 
                    value={dia.id}
                    className="flex-1 min-w-[50px] px-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    {dia.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8 mt-6">
            {groupedClasses.map((periodo) => (
              <div key={periodo.id} className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800">{periodo.name}</h2>
                </div>
                <div className="divide-y">
                  {periodo.aulas.length > 0 ? (
                    periodo.aulas.map((aula) => (
                      <div
                        key={aula.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {aula.start_time} - {aula.end_time}
                            </p>
                            <h3 className="text-lg font-semibold mt-1">
                              {aula.subject}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              Prof. {aula.professor.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={cn(
                              "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                              aula.course === 'TADS' && "bg-blue-100 text-blue-800",
                              aula.course === 'MSI' && "bg-purple-100 text-purple-800",
                              aula.course === 'Esp. IE' && "bg-green-100 text-green-800"
                            )}>
                              {aula.course}
                            </span>
                            <p className="text-gray-500 text-sm mt-1">
                              {aula.lab}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-gray-500">
                      Nenhuma aula encontrada neste período
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleTable; 