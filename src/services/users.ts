
import { supabase } from '@/integrations/supabase/client';

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    // First fetch auth users with the admin API
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    // Map the auth users to the format we need
    const users: User[] = authUsers.users.map(user => ({
      id: user.id,
      email: user.email || '',
      created_at: user.created_at || new Date().toISOString()
    }));
    
    return users;
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
