import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Clock, DollarSign, Trash2 } from "lucide-react";
import { AdicionarServico } from "@/components/forms/AdicionarServico";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}

const initialServices: Service[] = [
  { 
    id: 1, 
    name: "Corte Degradê", 
    description: "Corte moderno com degradê nas laterais",
    price: 45.00,
    duration: 30
  },
  { 
    id: 2, 
    name: "Corte + Barba", 
    description: "Corte completo com barba desenhada",
    price: 70.00,
    duration: 45
  },
  { 
    id: 3, 
    name: "Barba Completa", 
    description: "Barba desenhada e aparada",
    price: 35.00,
    duration: 20
  },
  { 
    id: 4, 
    name: "Corte Social", 
    description: "Corte clássico para o dia a dia",
    price: 40.00,
    duration: 25
  },
  { 
    id: 5, 
    name: "Platinado", 
    description: "Descoloração completa",
    price: 150.00,
    duration: 120
  },
];

const Servicos = () => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const { toast } = useToast();

  const handleSaveService = (serviceData: Omit<Service, 'id'> & { id?: number }) => {
    if (serviceData.id) {
      setServices(services.map(s => s.id === serviceData.id ? { ...serviceData, id: serviceData.id } : s));
    } else {
      const newService = {
        ...serviceData,
        id: Math.max(...services.map(s => s.id), 0) + 1
      };
      setServices([...services, newService]);
    }
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
    toast({
      title: "Serviço removido!",
      description: "O serviço foi removido do catálogo.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
            <p className="text-muted-foreground">Gerencie o catálogo de serviços</p>
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
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.id}
                className="p-4 hover:border-primary/50 transition-colors"
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-primary">
                        R$ {service.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <AdicionarServico 
                      service={service} 
                      onSave={handleSaveService}
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1">
                          Editar
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o serviço "{service.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteService(service.id)}>
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
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Servicos;
