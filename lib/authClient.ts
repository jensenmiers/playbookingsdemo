import { createSupabaseBrowserClient } from './supabaseBrowserClient';

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
} 