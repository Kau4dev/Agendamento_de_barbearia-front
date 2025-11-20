import { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Phone, Mail } from "lucide-react";
import { AdicionarBarbeiro } from "@/components/forms/AdicionarBarbeiro";
import { DetalhesBarbeiro } from "@/components/forms/DetalhesBarbeiro";

const initialBarbers = [
  { 
    id: 1, 
    name: "Carlos Silva", 
    specialty: "Cortes Clássicos", 
    phone: "(11) 99999-9999",
    email: "carlos@barber.com",
    appointments: 156,
    rating: 4.9
  },
  { 
    id: 2, 
    name: "Roberto Santos", 
    specialty: "Barbas & Degradês", 
    phone: "(11) 98888-8888",
    email: "roberto@barber.com",
    appointments: 142,
    rating: 4.8
  },
  { 
    id: 3, 
    name: "André Costa", 
    specialty: "Cortes Modernos", 
    phone: "(11) 97777-7777",
    email: "andre@barber.com",
    appointments: 128,
    rating: 4.7
  },
  { 
    id: 4, 
    name: "Felipe Oliveira", 
    specialty: "Especialista em Barba", 
    phone: "(11) 96666-6666",
    email: "felipe@barber.com",
    appointments: 134,
    rating: 4.8
  },
];

const Barbeiros = () => {
  const [barbers, setBarbers] = useState(initialBarbers);

  const handleUpdateBarber = (id: number, data: any) => {
    setBarbers(barbers.map(barber => 
      barber.id === id ? { ...barber, ...data } : barber
    ));
  };

  const handleDeleteBarber = (id: number) => {
    setBarbers(barbers.filter(barber => barber.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Barbeiros</h1>
            <p className="text-muted-foreground">Gerencie sua equipe</p>
          </div>
          <AdicionarBarbeiro />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <Card key={barber.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {barber.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{barber.name}</h3>
                    <p className="text-sm text-muted-foreground">{barber.specialty}</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  ⭐ {barber.rating}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{barber.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{barber.email}</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-3">
                  {barber.appointments} agendamentos este mês
                </p>
                <DetalhesBarbeiro 
                  barber={barber}
                  onUpdate={handleUpdateBarber}
                  onDelete={handleDeleteBarber}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Barbeiros;