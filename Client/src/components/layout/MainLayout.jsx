import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function MainLayout({ children, title, subtitle }) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Dynamic padding: No padding on mobile, 20/64 on desktop */}
      <div className="transition-all duration-300 lg:pl-64">
        {/* If desktop collapsed, this needs to be pl-20, but lg:pl-64 covers standard. 
            For full flexibility, use a shared state for 'collapsed' */}
        <div className="flex items-center p-4 lg:hidden border-b bg-sidebar text-sidebar-foreground">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <span className="ml-4 font-bold">Vrindavan Palace</span>
        </div>

        <Header title={title} subtitle={subtitle} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
