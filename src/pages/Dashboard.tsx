import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Scissors, TrendingUp } from "lucide-react";
import { AdicionarUsuario } from "@/components/forms/AdicionarUsuario";

const statsCards = [
  { title: "Agendamentos Hoje", value: "12", icon: Calendar, trend: "+3 desde ontem" },
  { title: "Total de Clientes", value: "248", icon: Users, trend: "+15 este mês" },
  { title: "Barbeiros Ativos", value: "4", icon: Scissors, trend: "Todos disponíveis" },
  { title: "Receita Mensal", value: "R$ 12.4k", icon: TrendingUp, trend: "+8% vs mês anterior" },
];

const upcomingAppointments = [
  { id: 1, client: "João Silva", barber: "Carlos", time: "14:00", service: "Corte + Barba" },
  { id: 2, client: "Pedro Santos", barber: "Roberto", time: "15:00", service: "Corte" },
  { id: 3, client: "Lucas Oliveira", barber: "Carlos", time: "15:30", service: "Barba" },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do seu negócio</p>
          </div>
          <AdicionarUsuario />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card key={index} className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Próximos Agendamentos
          </h2>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {appointment.client.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{appointment.client}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{appointment.time}</p>
                  <p className="text-sm text-muted-foreground">{appointment.barber}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
