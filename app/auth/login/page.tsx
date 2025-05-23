import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { signInWithEmail } from '@/lib/authClient';
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
      // Redirect or refresh
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign in to Playbookings</h1>
      <div className="space-y-3">
        <Button
          className="w-full bg-black text-white hover:bg-gray-900"
          onClick={() => handleSocialLogin('apple')}
          disabled={loading}
        >
          Continue with Apple
        </Button>
        <Button
          className="w-full bg-[#4285F4] text-white hover:bg-[#357ae8]"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
        >
          Continue with Google
        </Button>
      </div>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-2 text-gray-400 text-xs">or use email</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>
      <form className="space-y-4" onSubmit={handleEmailLogin}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <div className="text-center text-sm mt-2">
        <a href="/auth/reset" className="text-blue-600 hover:underline">Forgot password?</a>
      </div>
      <div className="text-center text-sm mt-2">
        Don&apos;t have an account?{' '}
        <a href="/auth/register" className="text-blue-600 hover:underline">Sign up</a>
      </div>
    </div>
  );
} 