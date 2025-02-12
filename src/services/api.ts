
import { supabase } from '@/integrations/supabase/client';
import { Class, NewsItem, Professor } from '@/types';

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
    }));
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw new Error('Não foi possível carregar os horários das aulas');
  }
}

export async function fetchActiveNews(): Promise<NewsItem[]> {
  try {
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Não foi possível carregar as notícias');
  }
}
