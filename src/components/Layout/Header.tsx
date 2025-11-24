import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationsSheet } from "@/components/NotificationsSheet";
import { PerfilUsuario } from "@/components/forms/PerfilUsuario";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logout realizado com sucesso!");
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex-1 md:flex-none">
        <h2 className="text-lg font-semibold text-foreground">
          Bem-vindo, {user?.nome || "Usuário"}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <NotificationsSheet />
        <PerfilUsuario />
      </div>
    </header>
  );
};
