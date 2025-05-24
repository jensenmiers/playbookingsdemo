'use client';

import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import { Textarea } from 'src/components/ui/textarea';
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [form, setForm] = useState({
    username: '',
    phone: '',
    user_type: 'renter',
    bio: '',
    preferred_location: '',
    skill_level: '',
    age_range: '',
    business_name: '',
    business_license: ''
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);
      
      // Check if user already has a complete profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile && profile.username) {
        // User already completed onboarding
        router.push('/dashboard');
        return;
      }
    };
    
    getUser();
  }, [supabase, router]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: form.username,
          phone: form.phone,
          user_type: form.user_type,
          bio: form.bio,
          preferred_location: form.preferred_location,
          skill_level: form.skill_level,
          age_range: form.age_range,
          business_name: form.user_type === 'owner' ? form.business_name : null,
          business_license: form.user_type === 'owner' ? form.business_license : null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Redirect to dashboard or appropriate page
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to PlayBookings!</h1>
        <p className="text-gray-600">Let's complete your profile to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Choose a unique username"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="user_type">Account Type *</Label>
            <Select value={form.user_type} onValueChange={(value) => handleChange('user_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="renter">Renter - I want to book courts</SelectItem>
                <SelectItem value="owner">Owner - I want to list my courts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell us a bit about yourself..."
              rows={3}
            />
          </div>
        </div>

        {/* Basketball Preferences (for renters) */}
        {form.user_type === 'renter' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basketball Preferences</h2>
            
            <div>
              <Label htmlFor="preferred_location">Preferred Location</Label>
              <Input
                id="preferred_location"
                value={form.preferred_location}
                onChange={(e) => handleChange('preferred_location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <Label htmlFor="skill_level">Skill Level</Label>
              <Select value={form.skill_level} onValueChange={(value) => handleChange('skill_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="pro">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="age_range">Age Range</Label>
              <Select value={form.age_range} onValueChange={(value) => handleChange('age_range', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_18">Under 18</SelectItem>
                  <SelectItem value="18_25">18-25</SelectItem>
                  <SelectItem value="26_35">26-35</SelectItem>
                  <SelectItem value="36_45">36-45</SelectItem>
                  <SelectItem value="46_plus">46+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Business Info (for owners) */}
        {form.user_type === 'owner' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Business Information</h2>
            
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={form.business_name}
                onChange={(e) => handleChange('business_name', e.target.value)}
                placeholder="Your business or facility name"
              />
            </div>

            <div>
              <Label htmlFor="business_license">Business License Number</Label>
              <Input
                id="business_license"
                value={form.business_license}
                onChange={(e) => handleChange('business_license', e.target.value)}
                placeholder="Optional business license number"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || !form.username}
        >
          {loading ? 'Completing Profile...' : 'Complete Profile'}
        </Button>
      </form>
    </div>
  );
} 