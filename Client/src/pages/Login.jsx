import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AppContext';
import { toast } from 'sonner';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (login(username, password)) {
      toast.success('Welcome back!', {
        description: 'You have successfully logged in.'
      });
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials', {
        description: 'Please check your username and password.'
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-hotel-gold mb-4 shadow-gold">
            <Building2 className="h-8 w-8 text-hotel-navy-dark" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary-foreground">Grand Palace Hotel</h1>
          <p className="text-primary-foreground/70 mt-2">Hotel Management System</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-display">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full hotel-button-navy" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center mb-4">Demo Credentials</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                  <span className="font-medium">Admin</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">admin / admin123</code>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                  <span className="font-medium">Manager</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">manager / manager123</code>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                  <span className="font-medium">Receptionist</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">receptionist / recep123</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-primary-foreground/60 mt-6">
          © 2024 Grand Palace Hotel. All rights reserved.
        </p>
      </div>
    </div>
  );
}
