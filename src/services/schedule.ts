import { supabase } from '@/integrations/supabase/client';
import { Class } from '@/types';

export const fetchSchedule = async (): Promise<Class[]> => {
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
    throw new Error('Erro ao carregar horários: ' + error.message);
  }

  return (data || []).map(cls => ({
    ...cls,
    professor: cls.professor as any,
    start_time: cls.start_time.slice(0, 5),
    end_time: cls.end_time.slice(0, 5),
    day_of_week: cls.day_of_week,
  }));
}; 