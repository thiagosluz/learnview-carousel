
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/types';

export async function fetchActiveNews(): Promise<NewsItem[]> {
  try {
    const now = new Date().toISOString();
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .eq('active', true)
      .lte('publish_start', now)
      .or(`publish_end.is.null,publish_end.gt.${now}`)
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

export async function fetchAllNews(): Promise<NewsItem[]> {
  try {
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
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
