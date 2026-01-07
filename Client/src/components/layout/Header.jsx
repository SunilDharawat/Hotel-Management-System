import { useAuth } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Search } from 'lucide-react';

export function Header({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 w-64 bg-muted/50"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-popover">
              <div className="p-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <DropdownMenuItem>New booking from Vikram Mehta</DropdownMenuItem>
              <DropdownMenuItem>Room 103 cleaning completed</DropdownMenuItem>
              <DropdownMenuItem>Payment received for INV-2024-001</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
