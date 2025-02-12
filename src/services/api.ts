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

export async function fetchProfessors(): Promise<Professor[]> {
  try {
    const { data: professors, error } = await supabase
      .from('professors')
      .select('*')
      .order('name');

    if (error) throw error;
    return professors;
  } catch (error) {
    console.error('Error fetching professors:', error);
    throw new Error('Não foi possível carregar a lista de professores');
  }
}

export async function fetchProfessor(id: string): Promise<Professor> {
  try {
    const { data: professor, error } = await supabase
      .from('professors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!professor) throw new Error('Professor não encontrado');
    
    return professor;
  } catch (error) {
    console.error('Error fetching professor:', error);
    throw new Error('Não foi possível carregar os dados do professor');
  }
}

export async function createProfessor({ name, photo }: { name: string; photo?: File }): Promise<void> {
  try {
    let photo_url = '';
    
    if (photo) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('professor_photos')
        .upload(fileName, photo);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('professor_photos')
        .getPublicUrl(fileName);
        
      photo_url = publicUrl;
    }

    const { error } = await supabase
      .from('professors')
      .insert([{ name, photo_url }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating professor:', error);
    throw new Error('Não foi possível cadastrar o professor');
  }
}

export async function updateProfessor(
  id: string, 
  { name, photo }: { name: string; photo?: File }
): Promise<void> {
  try {
    const updates: { name: string; photo_url?: string } = { name };

    if (photo) {
      // Deletar foto antiga
      const { data: oldProfessor } = await supabase
        .from('professors')
        .select('photo_url')
        .eq('id', id)
        .single();

      if (oldProfessor?.photo_url) {
        const oldFileName = oldProfessor.photo_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('professor_photos')
            .remove([oldFileName]);
        }
      }

      // Upload nova foto
      const fileExt = photo.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('professor_photos')
        .upload(fileName, photo);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('professor_photos')
        .getPublicUrl(fileName);
        
      updates.photo_url = publicUrl;
    }

    const { error } = await supabase
      .from('professors')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating professor:', error);
    throw new Error('Não foi possível atualizar o professor');
  }
}

export async function deleteProfessor(id: string): Promise<void> {
  try {
    // Primeiro, obtemos a URL da foto para poder deletá-la do storage
    const { data: professor } = await supabase
      .from('professors')
      .select('photo_url')
      .eq('id', id)
      .single();

    if (professor?.photo_url) {
      const fileName = professor.photo_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('professor_photos')
          .remove([fileName]);
      }
    }

    const { error } = await supabase
      .from('professors')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting professor:', error);
    throw new Error('Não foi possível excluir o professor');
  }
}
