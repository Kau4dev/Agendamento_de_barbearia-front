import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Scissors, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cadastroSchema } from "@/lib/validations";
import { z } from "zod";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    nome?: string;
    email?: string;
    telefone?: string;
    senha?: string;
    confirmSenha?: string;
  }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validateField = (
    field: "nome" | "email" | "telefone" | "senha" | "confirmSenha",
    value: string
  ) => {
    // Limpa o erro enquanto digita se o campo estiver vazio
    if (!value) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      return;
    }

    try {
      // Valida o campo específico
      const fieldData = {
        nome: field === "nome" ? value : nome,
        email: field === "email" ? value : email,
        telefone: field === "telefone" ? value : telefone,
        senha: field === "senha" ? value : password,
        confirmSenha: field === "confirmSenha" ? value : confirmPassword,
      };

      cadastroSchema.parse(fieldData);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((e) => e.path[0] === field);
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [field]: fieldError.message }));
        } else {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validação completa
      cadastroSchema.parse({
        nome,
        email,
        telefone,
        senha: password,
        confirmSenha: confirmPassword,
      });
      setErrors({});

      setLoading(true);
      await api.auth.register({ nome, email, telefone, senha: password });
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>Cadastro realizado com sucesso!</span>
        </div>
      );
      navigate("/login");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Por favor, corrija os erros no formulário");
      } else if (error instanceof Error) {
        toast.error(error.message || "Erro ao realizar cadastro");
      } else {
        toast.error("Erro ao realizar cadastro");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-2">
            <Scissors className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Criar Conta</h1>
          <p className="text-muted-foreground text-center">
            Preencha os dados para se cadastrar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                validateField("nome", e.target.value);
              }}
              className={errors.nome ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              className={errors.email ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => {
                setTelefone(e.target.value);
                validateField("telefone", e.target.value);
              }}
              className={errors.telefone ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.telefone && (
              <p className="text-sm text-destructive">{errors.telefone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("senha", e.target.value);
              }}
              className={errors.senha ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.senha && (
              <p className="text-sm text-destructive">{errors.senha}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateField("confirmSenha", e.target.value);
              }}
              className={errors.confirmSenha ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.confirmSenha && (
              <p className="text-sm text-destructive">{errors.confirmSenha}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => navigate("/login")}
            >
              Fazer login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Cadastro;
