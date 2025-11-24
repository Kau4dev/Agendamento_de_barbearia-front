import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import type { Cliente } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Phone, Mail, Pencil, Trash2 } from "lucide-react";
import { AdicionarCliente } from "@/components/forms/AdicionarCliente";
import { PerfilCliente } from "@/components/forms/PerfilCliente";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Clientes = () => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadClients = async () => {
    try {
      const data = await api.clientes.getAll();
      setClients(data ?? []);
    } catch (error: unknown) {
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCliente = async (id: number, nome: string) => {
    try {
      await api.clientes.delete(id);
      toast.success(`${nome} foi removido dos clientes.`);
      loadClients();
    } catch (error: unknown) {
      toast.error("Erro ao remover cliente");
    }
  };

  useEffect(() => {
    loadClients();
  }, []);
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">Gerencie seus clientes</p>
          </div>
          <AdicionarCliente onSuccess={loadClients} />
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente por nome, telefone ou email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="space-y-3">
              {clients
                .filter((client) => {
                  const term = searchTerm.toLowerCase();
                  return (
                    client.nome.toLowerCase().includes(term) ||
                    client.telefone.toLowerCase().includes(term) ||
                    client.email.toLowerCase().includes(term)
                  );
                })
                .map((client) => {
                  const initials = client.nome
                    ? client.nome
                        .split(" ")
                        .map((n: string) => (n && n.length ? n[0] : ""))
                        .join("")
                        .slice(0, 2)
                    : "";

                  return (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {initials || "—"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {client.nome}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{client.telefone}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span>{client.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Última visita
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {client.agendamentos?.[0]?.dataHora
                              ? new Date(
                                  client.agendamentos[0].dataHora
                                ).toLocaleDateString("pt-BR")
                              : "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Total de visitas
                          </p>
                          <p className="text-sm font-medium text-primary">
                            {client.agendamentos?.length || 0}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <PerfilCliente client={client} />
                          <AdicionarCliente
                            cliente={client}
                            onSuccess={loadClients}
                            trigger={
                              <Button variant="outline" size="sm">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            }
                          />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirmar exclusão
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir {client.nome}?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteCliente(client.id, client.nome)
                                  }
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Clientes;
