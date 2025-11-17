import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { NovoAgendamento } from "@/components/forms/NovoAgendamento";

const appointments = [
  { id: 1, time: "09:00", client: "João Silva", barber: "Carlos", service: "Corte + Barba", status: "confirmed" },
  { id: 2, time: "10:00", client: "Pedro Santos", barber: "Roberto", service: "Corte", status: "confirmed" },
  { id: 3, time: "11:30", client: "Lucas Oliveira", barber: "Carlos", service: "Barba", status: "pending" },
  { id: 4, time: "14:00", client: "Marcos Costa", barber: "André", service: "Corte + Barba", status: "confirmed" },
  { id: 5, time: "15:00", client: "Rafael Lima", barber: "Roberto", service: "Corte", status: "confirmed" },
];

const Agenda = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground">Gerencie seus agendamentos</p>
          </div>
          <NovoAgendamento />
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Hoje - {new Date().toLocaleDateString('pt-BR')}</h2>
          </div>

          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10">
                    <span className="text-xs font-medium text-muted-foreground">Horário</span>
                    <span className="text-lg font-bold text-primary">{appointment.time}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{appointment.client}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                    <p className="text-xs text-muted-foreground mt-1">Barbeiro: {appointment.barber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === "confirmed"
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                  </span>
                  <Button variant="outline" size="sm">Detalhes</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Agenda;