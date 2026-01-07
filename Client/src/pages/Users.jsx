import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/contexts/AppContext';
import { UserCog, Plus, Mail } from 'lucide-react';

export default function Users() {
  const { users } = useUsers();

  return (
    <MainLayout title="User Management" subtitle="Manage system users and roles">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-end">
          <Button className="hotel-button-gold"><Plus className="h-4 w-4 mr-2" />Add User</Button>
        </div>

        <div className="grid gap-4">
          {users.map(user => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCog className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />{user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                    <Badge className={user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
