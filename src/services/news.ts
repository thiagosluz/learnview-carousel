
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/types';

export async function fetchActiveNews(): Promise<NewsItem[]> {
  try {
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return news.map(item => ({
      ...item,
      type: item.type as 'text' | 'image'
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Não foi possível carregar as notícias');
  }
}

export async function fetchNews(id: string): Promise<NewsItem> {
  try {
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!news) throw new Error('Notícia não encontrada');
    
    return {
      ...news,
      type: news.type as 'text' | 'image'
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Não foi possível carregar os dados da notícia');
  }
}

export async function createNews({
  title,
  type,
  content,
  duration,
  active,
}: {
  title: string;
  type: 'text' | 'image';
  content: string;
  duration: number;
  active: boolean;
}): Promise<void> {
  try {
    const { error } = await supabase
      .from('news')
      .insert([{ 
        title,
        type,
        content,
        duration,
        active,
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating news:', error);
    throw new Error('Não foi possível cadastrar a notícia');
  }
}

export async function updateNews(
  id: string,
  {
    title,
    type,
    content,
    duration,
    active,
  }: {
    title: string;
    type: 'text' | 'image';
    content: string;
    duration: number;
    active: boolean;
  }
): Promise<void> {
  try {
    const { error } = await supabase
      .from('news')
      .update({ 
        title,
        type,
        content,
        duration,
        active,
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating news:', error);
    throw new Error('Não foi possível atualizar a notícia');
  }
}

export async function deleteNews(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw new Error('Não foi possível excluir a notícia');
  }
}
