
import { supabase } from '@/integrations/supabase/client';

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, created_at');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (email: string, password: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
