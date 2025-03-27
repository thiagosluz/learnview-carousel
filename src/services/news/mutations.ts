
import { supabase } from '@/integrations/supabase/client';
import { uploadNewsImage, deleteNewsImage } from './storage';

export async function createNews({
  title,
  type,
  content,
  duration,
  active,
  image,
  publish_start,
  publish_end,
  course,
}: {
  title: string;
  type: 'text' | 'image';
  content: string;
  duration: number;
  active: boolean;
  image?: File;
  publish_start: string;
  publish_end?: string | null;
  course?: string | null;
}): Promise<void> {
  try {
    let finalContent = content;

    if (type === 'image' && image) {
      finalContent = await uploadNewsImage(image);
    }

    const { error } = await supabase
      .from('news')
      .insert([{ 
        title,
        type,
        content: finalContent,
        duration,
        active,
        publish_start,
        publish_end,
        course: course === 'all' ? null : course,
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
    image,
    publish_start,
    publish_end,
    course,
  }: {
    title: string;
    type: 'text' | 'image';
    content: string;
    duration: number;
    active: boolean;
    image?: File;
    publish_start: string;
    publish_end?: string | null;
    course?: string | null;
  }
): Promise<void> {
  try {
    let finalContent = content;

    if (type === 'image' && image) {
      finalContent = await uploadNewsImage(image);
    }

    const { error } = await supabase
      .from('news')
      .update({ 
        title,
        type,
        content: finalContent,
        duration,
        active,
        publish_start,
        publish_end,
        course: course === 'all' ? null : course,
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
    const { data: news, error: fetchError } = await supabase
      .from('news')
      .select('type, content')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (news && news.type === 'image' && news.content) {
      try {
        await deleteNewsImage(news.content);
      } catch (storageError) {
        console.error('Error in storage operation:', storageError);
      }
    }

    const { error: deleteError } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw new Error('Não foi possível excluir a notícia');
  }
}
