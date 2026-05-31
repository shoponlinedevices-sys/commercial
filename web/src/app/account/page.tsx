'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, LogOut } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-lg font-semibold">{user?.username}</p>
              </div>
              {user?.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg font-semibold flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <p className="text-lg font-semibold">{user?.id}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/account/personal-info')}
              >
                <User className="h-4 w-4 mr-2" />
                Personal Information
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/account/delivery-address')}
              >
                📍 Delivery Addresses
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/account/payment-method')}
              >
                💳 Payment Methods
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/orders')}
              >
                View Orders
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/cart')}
              >
                View Cart
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/notifications')}
              >
                View Notifications
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
