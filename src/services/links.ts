
import { supabase } from '@/integrations/supabase/client';

export interface Link {
  id: string;
  name: string;
  url: string;
}

export const fetchLinks = async () => {
  const { data, error } = await supabase
    .from('coordination_links')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

export const fetchLink = async (id: string) => {
  const { data, error } = await supabase
    .from('coordination_links')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createLink = async ({ name, url }: Omit<Link, 'id'>) => {
  const { data, error } = await supabase
    .from('coordination_links')
    .insert({ name, url })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateLink = async (id: string, { name, url }: Partial<Omit<Link, 'id'>>) => {
  const { data, error } = await supabase
    .from('coordination_links')
    .update({ name, url })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteLink = async (id: string) => {
  const { error } = await supabase
    .from('coordination_links')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
