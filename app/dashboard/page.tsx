'use client';

import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { useUser } from '@/lib/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, profile, loading, signOut, isAuthenticated, hasCompletedProfile } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }
      
      if (!hasCompletedProfile) {
        router.push('/onboarding');
        return;
      }

      // Redirect to appropriate dashboard based on user type
      if (profile?.user_type === 'owner') {
        router.push('/dashboard/owner');
      } else if (profile?.user_type === 'renter') {
        router.push('/dashboard/renter');
      }
    }
  }, [loading, isAuthenticated, hasCompletedProfile, profile, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome back, {profile?.full_name || profile?.username}!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Username:</strong> {profile?.username}</p>
              <p><strong>Account Type:</strong> {profile?.user_type}</p>
              <p><strong>Phone:</strong> {profile?.phone || 'Not provided'}</p>
            </div>
            <div>
              {profile?.user_type === 'renter' && (
                <>
                  <p><strong>Skill Level:</strong> {profile?.skill_level || 'Not set'}</p>
                  <p><strong>Preferred Location:</strong> {profile?.preferred_location || 'Not set'}</p>
                  <p><strong>Age Range:</strong> {profile?.age_range || 'Not set'}</p>
                </>
              )}
              {profile?.user_type === 'owner' && (
                <>
                  <p><strong>Business:</strong> {profile?.business_name || 'Not provided'}</p>
                  <p><strong>License:</strong> {profile?.business_license || 'Not provided'}</p>
                </>
              )}
            </div>
          </div>
          {profile?.bio && (
            <div className="mt-4">
              <p><strong>Bio:</strong> {profile.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile?.user_type === 'renter' && (
              <>
                <Button className="w-full" onClick={() => router.push('/search')}>
                  Search Courts
                </Button>
                <Button className="w-full" variant="outline" onClick={() => router.push('/dashboard/renter/bookings')}>
                  My Bookings
                </Button>
              </>
            )}
            {profile?.user_type === 'owner' && (
              <>
                <Button className="w-full" onClick={() => router.push('/dashboard/owner/listings/new')}>
                  Create Listing
                </Button>
                <Button className="w-full" variant="outline" onClick={() => router.push('/dashboard/owner/bookings')}>
                  Manage Bookings
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" onClick={() => router.push('/profile/edit')}>
              Edit Profile
            </Button>
            <Button className="w-full" variant="outline" onClick={() => router.push('/settings')}>
              Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 