
import { supabase } from '@/integrations/supabase/client';
import { Class, Professor } from '@/types';

export async function fetchTodayClasses(): Promise<Class[]> {
  const today = new Date().getDay();
  
  try {
    const { data: classes, error } = await supabase
      .from('classes')
      .select(`
        id,
        start_time,
        end_time,
        subject,
        lab,
        day_of_week,
        professor:professors(id, name, photo_url)
      `)
      .eq('day_of_week', today)
      .order('start_time');

    if (error) throw error;

    return classes.map(cls => ({
      ...cls,
      professor: cls.professor as Professor,
      start_time: cls.start_time.slice(0, 5),
      end_time: cls.end_time.slice(0, 5),
      day_of_week: cls.day_of_week,
    }));
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw new Error('Não foi possível carregar os horários das aulas');
  }
}

export async function fetchAllClasses(): Promise<Class[]> {
  try {
    const { data: classes, error } = await supabase
      .from('classes')
      .select(`
        id,
        start_time,
        end_time,
        subject,
        lab,
        day_of_week,
        professor:professors(id, name, photo_url)
      `)
      .order('day_of_week')
      .order('start_time');

    if (error) throw error;

    return classes.map(cls => ({
      ...cls,
      professor: cls.professor as Professor,
      start_time: cls.start_time.slice(0, 5),
      end_time: cls.end_time.slice(0, 5),
      day_of_week: cls.day_of_week,
    }));
  } catch (error) {
    console.error('Error fetching all classes:', error);
    throw new Error('Não foi possível carregar a lista de aulas');
  }
}

export async function fetchClass(id: string): Promise<Class> {
  try {
    const { data: class_, error } = await supabase
      .from('classes')
      .select(`
        id,
        start_time,
        end_time,
        subject,
        lab,
        day_of_week,
        professor:professors(id, name, photo_url)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!class_) throw new Error('Aula não encontrada');
    
    return {
      ...class_,
      professor: class_.professor as Professor,
      start_time: class_.start_time.slice(0, 5),
      end_time: class_.end_time.slice(0, 5),
      day_of_week: class_.day_of_week,
    };
  } catch (error) {
    console.error('Error fetching class:', error);
    throw new Error('Não foi possível carregar os dados da aula');
  }
}

export async function createClass({
  subject,
  start_time,
  end_time,
  professor_id,
  lab,
  day_of_week,
}: {
  subject: string;
  start_time: string;
  end_time: string;
  professor_id: string;
  lab: string;
  day_of_week: number;
}): Promise<void> {
  try {
    const { error } = await supabase
      .from('classes')
      .insert([{ 
        subject,
        start_time,
        end_time,
        professor_id,
        lab,
        day_of_week,
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating class:', error);
    throw new Error('Não foi possível cadastrar a aula');
  }
}

export async function updateClass(
  id: string,
  {
    subject,
    start_time,
    end_time,
    professor_id,
    lab,
    day_of_week,
  }: {
    subject: string;
    start_time: string;
    end_time: string;
    professor_id: string;
    lab: string;
    day_of_week: number;
  }
): Promise<void> {
  try {
    const { error } = await supabase
      .from('classes')
      .update({ 
        subject,
        start_time,
        end_time,
        professor_id,
        lab,
        day_of_week,
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating class:', error);
    throw new Error('Não foi possível atualizar a aula');
  }
}

export async function deleteClass(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting class:', error);
    throw new Error('Não foi possível excluir a aula');
  }
}
