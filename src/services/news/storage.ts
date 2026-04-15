
import { supabase } from '@/integrations/supabase/client';

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

export async function deleteNewsImage(imageUrl: string): Promise<void> {
  const fileUrl = new URL(imageUrl);
  const pathParts = fileUrl.pathname.split('/');
  const fileName = pathParts[pathParts.length - 1];
  
  if (fileName) {
    const { error: storageError } = await supabase.storage
      .from('news-images')
      .remove([fileName]);

    if (storageError) {
      throw storageError;
    }
  }
}
