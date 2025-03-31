
import { supabase } from '@/integrations/supabase/client';
import { Class } from '@/types';

export const fetchSchedule = async (): Promise<Class[]> => {
  // console.log('Iniciando busca de horários...');
  
  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      professor:professors (
        id,
        name
      )
    `)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Erro ao buscar horários:', error);
    throw new Error('Erro ao carregar horários: ' + error.message);
  }

  // console.log('Dados brutos recebidos:', data);

  const formattedClasses = (data || []).map(cls => {
    const formatted = {
      ...cls,
      professor: cls.professor as any,
      start_time: cls.start_time.slice(0, 5),
      end_time: cls.end_time.slice(0, 5),
      day_of_week: cls.day_of_week,
    };
    
    // console.log('Aula formatada:', formatted);
    
    return formatted;
  });

  // console.log('Total de aulas formatadas:', formattedClasses.length);
  return formattedClasses;
}; 
