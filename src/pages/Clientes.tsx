import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Phone, Mail } from "lucide-react";

const clients = [
  { 
    id: 1, 
    name: "João Silva", 
    phone: "(11) 99999-0001",
    email: "joao@email.com",
    lastVisit: "15/01/2025",
    totalVisits: 12
  },
  { 
    id: 2, 
    name: "Pedro Santos", 
    phone: "(11) 99999-0002",
    email: "pedro@email.com",
    lastVisit: "14/01/2025",
    totalVisits: 8
  },
  { 
    id: 3, 
    name: "Lucas Oliveira", 
    phone: "(11) 99999-0003",
    email: "lucas@email.com",
    lastVisit: "13/01/2025",
    totalVisits: 15
  },
  { 
    id: 4, 
    name: "Marcos Costa", 
    phone: "(11) 99999-0004",
    email: "marcos@email.com",
    lastVisit: "12/01/2025",
    totalVisits: 6
  },
  { 
    id: 5, 
    name: "Rafael Lima", 
    phone: "(11) 99999-0005",
    email: "rafael@email.com",
    lastVisit: "11/01/2025",
    totalVisits: 10
  },
];

const Clientes = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">Gerencie seus clientes</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Cliente
          </Button>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente por nome, telefone ou email..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {client.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{client.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{client.phone}</span>
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
                    <p className="text-sm text-muted-foreground">Última visita</p>
                    <p className="text-sm font-medium text-foreground">{client.lastVisit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total de visitas</p>
                    <p className="text-sm font-medium text-primary">{client.totalVisits}</p>
                  </div>
                  <Button variant="outline" size="sm">Ver Perfil</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Clientes;
