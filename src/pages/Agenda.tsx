import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import type { Agendamento } from "@/types";
import { Clock } from "lucide-react";
import { NovoAgendamento } from "@/components/forms/NovoAgendamento";
import { DetalhesAgendamento } from "@/components/forms/DetalhesAgendamento";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Agenda = () => {
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const data = await api.agendamentos.getAll();
      setAppointments(data);
    } catch (error: unknown) {
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleDeleteAppointment = async (id: number) => {
    try {
      await api.agendamentos.delete(id);
      toast.success("Agendamento removido com sucesso!");
      loadAppointments();
    } catch (error: unknown) {
      toast.error("Erro ao remover agendamento");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground">Gerencie seus agendamentos</p>
          </div>
          <NovoAgendamento onSuccess={loadAppointments} />
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Hoje - {new Date().toLocaleDateString("pt-BR")}
            </h2>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10">
                      <span className="text-xs font-medium text-muted-foreground">
                        Horário
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {new Date(appointment.dataHora).toLocaleTimeString(
                          "pt-BR",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {appointment.cliente?.nome || "Cliente"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.servico?.nome || "Serviço"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Barbeiro: {appointment.barbeiro?.nome || "Barbeiro"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "CONFIRMADO"
                          ? "bg-primary/20 text-primary"
                          : appointment.status === "CONCLUIDO"
                          ? "bg-green-500/20 text-green-700"
                          : appointment.status === "CANCELADO"
                          ? "bg-red-500/20 text-red-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {appointment.status === "CONFIRMADO"
                        ? "Confirmado"
                        : appointment.status === "CONCLUIDO"
                        ? "Concluído"
                        : appointment.status === "CANCELADO"
                        ? "Cancelado"
                        : "Pendente"}
                    </span>
                    <DetalhesAgendamento
                      appointment={appointment}
                      onUpdate={loadAppointments}
                      onDelete={handleDeleteAppointment}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Agenda;
