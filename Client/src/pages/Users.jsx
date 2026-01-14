import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { useUsers } from "@/contexts/App";
import { UserCog, Plus, Mail, Contact } from "lucide-react";
import { usersAPI } from "@/api/users";
import { useQuery } from "@tanstack/react-query";

export default function Users() {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users", { limit: 1 }],
    queryFn: () => usersAPI.getAll({ limit: 10 }),
    select: (response) => response.data.users,
  });

  return (
    <MainLayout
      title="User Management"
      subtitle="Manage system users and roles"
    >
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-end">
          <Button className="hotel-button-gold">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="grid gap-4">
          {users?.map((user) => (
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
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Contact className="h-3 w-3" />
                        {user.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                    <Badge
                      className={
                        user.is_active === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {user.is_active === 1 ? "Active" : "Inactive"}
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
