
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
import { createClass, updateClass, fetchClass, fetchProfessors } from '@/services/api';
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

const ClassForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [subject, setSubject] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [lab, setLab] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<string>('');

  const { data: professors } = useQuery({
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
            <Input
              id="lab"
              value={lab}
              onChange={(e) => setLab(e.target.value)}
              placeholder="Número ou nome do laboratório"
              required
            />
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
