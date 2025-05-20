'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpWithEmail } from '@/lib/auth';
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signUpWithEmail(email, password);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Create your account</h1>
      <div className="space-y-3">
        <Button
          className="w-full bg-black text-white hover:bg-gray-900"
          onClick={() => handleSocialSignUp('apple')}
          disabled={loading}
        >
          Sign up with Apple
        </Button>
        <Button
          className="w-full bg-[#4285F4] text-white hover:bg-[#357ae8]"
          onClick={() => handleSocialSignUp('google')}
          disabled={loading}
        >
          Sign up with Google
        </Button>
      </div>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-2 text-gray-400 text-xs">or use email</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>
      <form className="space-y-4" onSubmit={handleEmailRegister}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={loading}
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>
      <div className="text-center text-sm mt-2">
        Already have an account?{' '}
        <a href="/auth/login" className="text-blue-600 hover:underline">Sign in</a>
      </div>
    </div>
  );
} 