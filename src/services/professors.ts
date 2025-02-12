
import { supabase } from '@/integrations/supabase/client';
import { Professor } from '@/types';

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
