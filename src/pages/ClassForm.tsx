import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createClass, updateClass, fetchClass, fetchProfessors } from '@/services';
import { Professor } from '@/types';

const DIAS_SEMANA = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' }
];

const LABORATORIOS = [
  'Laboratório 01',
  'Laboratório 02',
  'Laboratório 03',
  'Laboratório 04',
  'Laboratório TADS 01',
  'Laboratório TADS 02',
  'Laboratório TADS 03',
  'Laboratório REDES',
  'Laboratório MSI 01',
  'Laboratório MSI 02',
  'EAD'
];

const COURSES = [
  { value: 'TADS', label: 'TADS - Tecnologia em Análise e Desenvolvimento de Sistemas' },
  { value: 'MSI', label: 'MSI - Manutenção e Suporte em Informática' },
  { value: 'Esp. IE', label: 'Especialização em Informática na Educação' }
];

const ClassForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [subject, setSubject] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [lab, setLab] = useState(LABORATORIOS[0]);
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [course, setCourse] = useState('TADS');
  const [period, setPeriod] = useState<string>('');

  const { data: professors = [] } = useQuery<Professor[]>({
    queryKey: ['professors'],
    queryFn: fetchProfessors,
  });

  useEffect(() => {
    if (isEditMode) {
      fetchClass(id).then((class_) => {
        setSubject(class_.subject);
        setStartTime(class_.start_time);
        setEndTime(class_.end_time);
        setProfessorId(class_.professor.id);
        setLab(class_.lab);
        setDayOfWeek(class_.day_of_week.toString());
        setCourse(class_.course || 'TADS'); // Default to TADS if not set
        setPeriod(class_.period || ''); // Set period if available
      }).catch((error) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar aula",
          description: error.message,
        });
        navigate('/classes');
      });
    }
  }, [id, isEditMode, navigate, toast]);

  // Get period options based on selected course
  const getPeriodOptions = () => {
    if (course === 'TADS') {
      return Array.from({ length: 6 }, (_, i) => {
        const period = `${i + 1}º Período`;
        return { value: period, label: period };
      });
    } else if (course === 'MSI') {
      return Array.from({ length: 3 }, (_, i) => {
        const period = `${i + 1}º Ano`;
        return { value: period, label: period };
      });
    } else if (course === 'Esp. IE') {
      return [
        { value: 'Turma 2025/01', label: 'Turma 2025/01' },
        { value: 'Turma 2025/02', label: 'Turma 2025/02' }
      ];
    }
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updateClass(id, {
          subject,
          start_time: startTime,
          end_time: endTime,
          professor_id: professorId,
          lab,
          day_of_week: parseInt(dayOfWeek),
          course,
          period,
        });
        toast({
          title: "Aula atualizada",
          description: "A aula foi atualizada com sucesso.",
        });
      } else {
        await createClass({
          subject,
          start_time: startTime,
          end_time: endTime,
          professor_id: professorId,
          lab,
          day_of_week: parseInt(dayOfWeek),
          course,
          period,
        });
        toast({
          title: "Aula cadastrada",
          description: "A aula foi cadastrada com sucesso.",
        });
      }
      navigate('/classes');
    } catch (error) {
      toast({
        variant: "destructive",
        title: isEditMode ? "Erro ao atualizar aula" : "Erro ao cadastrar aula",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar a solicitação",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Editar Aula' : 'Nova Aula'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Disciplina</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Nome da disciplina"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Horário de Início</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Horário de Término</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Dia da Semana</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia da semana" />
              </SelectTrigger>
              <SelectContent>
                {DIAS_SEMANA.map((dia) => (
                  <SelectItem key={dia.value} value={dia.value.toString()}>
                    {dia.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Curso</Label>
            <RadioGroup 
              value={course} 
              onValueChange={(value) => {
                setCourse(value);
                setPeriod(''); // Reset period when course changes
              }}
              className="flex flex-col space-y-2 mt-1"
            >
              {COURSES.map((courseOption) => (
                <div key={courseOption.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={courseOption.value} id={`course-${courseOption.value}`} />
                  <Label htmlFor={`course-${courseOption.value}`} className="font-normal cursor-pointer">
                    {courseOption.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Período</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                {getPeriodOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="professor">Professor</Label>
            <Select value={professorId} onValueChange={setProfessorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o professor" />
              </SelectTrigger>
              <SelectContent>
                {professors?.map((professor: Professor) => (
                  <SelectItem key={professor.id} value={professor.id}>
                    {professor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lab">Laboratório</Label>
            <Select value={lab} onValueChange={setLab}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o laboratório" />
              </SelectTrigger>
              <SelectContent>
                {LABORATORIOS.map((laboratorio) => (
                  <SelectItem key={laboratorio} value={laboratorio}>
                    {laboratorio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit">
              {isEditMode ? 'Atualizar' : 'Cadastrar'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/classes')}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;
