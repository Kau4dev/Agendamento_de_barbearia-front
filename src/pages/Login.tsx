import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Scissors } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // <--- ADICIONADO
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => { // <--- 'async' ADICIONADO
    e.preventDefault();
    setIsLoading(true); // Bloqueia o formulário

    // A lógica falsa foi substituída por esta chamada de API
    try {
      // 1. Chamar seu backend
      const response = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 2. Tratar erro do backend
      if (!response.ok) {
        throw new Error(data.message || "Falha ao tentar fazer login");
      }

      // 3. Tratar sucesso
      toast.success("Login realizado com sucesso!");

      // Salva o token no localStorage para usar depois
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      navigate("/dashboard");
    } catch (error: any) {
      // 4. Mostrar erro no toast
      toast.error(error.message || "Erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false); // Libera o formulário
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-2">
            <Scissors className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Barber Pro</h1>
          <p className="text-muted-foreground text-center">
            Sistema de Gerenciamento
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading} // <--- ADICIONADO
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading} // <--- ADICIONADO
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {/* Muda o texto do botão durante o loading */}
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;