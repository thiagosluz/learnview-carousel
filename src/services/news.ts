
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

export async function uploadNewsImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Não foi possível fazer o upload da imagem');
  }
}

export async function createNews({
  title,
  type,
  content,
  duration,
  active,
  image,
  publish_start,
  publish_end,
}: {
  title: string;
  type: 'text' | 'image';
  content: string;
  duration: number;
  active: boolean;
  image?: File;
  publish_start: string;
  publish_end?: string | null;
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
  }: {
    title: string;
    type: 'text' | 'image';
    content: string;
    duration: number;
    active: boolean;
    image?: File;
    publish_start: string;
    publish_end?: string | null;
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
    // Primeiro, busca a notícia para verificar se é do tipo imagem
    const { data: news, error: fetchError } = await supabase
      .from('news')
      .select('type, content')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Se for uma notícia com imagem, exclui a imagem do storage
    if (news && news.type === 'image' && news.content) {
      try {
        // Extrai o nome do arquivo da URL
        const fileUrl = new URL(news.content);
        const pathParts = fileUrl.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        if (fileName) {
          console.log('Attempting to delete file:', fileName);
          
          // Lista os arquivos para verificar se existe
          const { data: files } = await supabase.storage
            .from('news-images')
            .list();
          
          console.log('Files in bucket:', files);
          
          // Tenta excluir o arquivo
          const { error: storageError } = await supabase.storage
            .from('news-images')
            .remove([fileName]);

          if (storageError) {
            console.error('Storage error:', storageError);
            throw storageError;
          }

          // Verifica se o arquivo foi realmente excluído
          const { data: remainingFiles } = await supabase.storage
            .from('news-images')
            .list();
            
          console.log('Remaining files after deletion:', remainingFiles);
          
          const fileStillExists = remainingFiles?.some(file => file.name === fileName);
          if (fileStillExists) {
            console.log('File still exists after deletion attempt');
          } else {
            console.log('File successfully deleted');
          }
        }
      } catch (storageError) {
        console.error('Error in storage operation:', storageError);
        // Continua com a exclusão da notícia mesmo se houver erro ao excluir a imagem
      }
    }

    // Exclui a notícia do banco de dados
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
