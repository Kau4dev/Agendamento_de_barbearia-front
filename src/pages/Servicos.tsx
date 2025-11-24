import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import type { Servico } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Clock, DollarSign, Trash2 } from "lucide-react";
import { AdicionarServico } from "@/components/forms/AdicionarServico";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { toast as sonnerToast } from "sonner";

const Servicos = () => {
  const [services, setServices] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const loadServices = async () => {
    try {
      const data = await api.servicos.getAll();
      setServices(data);
    } catch (error: unknown) {
      sonnerToast.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSaveService = async (
    serviceData: Omit<Servico, "id"> & { id?: number }
  ) => {
    try {
      if (serviceData.id) {
        await api.servicos.update(serviceData.id, serviceData);
      } else {
        await api.servicos.create(serviceData);
      }
      loadServices();
    } catch (error: unknown) {
      sonnerToast.error("Erro ao salvar serviço");
      throw error;
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      await api.servicos.delete(id);
      toast({
        title: "Serviço removido!",
        description: "O serviço foi removido do catálogo.",
      });
      loadServices();
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: "Erro ao remover serviço",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
            <p className="text-muted-foreground">
              Gerencie o catálogo de serviços
            </p>
          </div>
          <AdicionarServico onSave={handleSaveService} />
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar serviço..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services
                .filter(
                  (service) =>
                    service.nome
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    service.descricao
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((service) => (
                  <Card
                    key={service.id}
                    className="p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {service.nome}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {service.descricao}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-primary">
                            R$ {service.preco.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{service.duracao} min</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <AdicionarServico
                          service={service}
                          onSave={handleSaveService}
                          trigger={
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Editar
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
                                Tem certeza que deseja excluir o serviço "
                                {service.nome}"? Esta ação não pode ser
                                desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteService(service.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Servicos;
