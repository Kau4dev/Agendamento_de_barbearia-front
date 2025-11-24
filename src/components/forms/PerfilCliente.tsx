import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, Calendar, Clock, Scissors } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Cliente, Agendamento } from "@/types";

interface PerfilClienteProps {
  client: Cliente;
}

export const PerfilCliente = ({ client }: PerfilClienteProps) => {
  const [open, setOpen] = useState(false);

  // Construir histórico a partir dos agendamentos incluídos no cliente
  const appointmentHistory = (client.agendamentos || []).map(
    (ag: Agendamento) => ({
      date: new Date(ag.dataHora).toLocaleDateString("pt-BR"),
      service: ag.servico?.nome || "Serviço",
      barber: ag.barbeiro?.nome || "Barbeiro",
      value: ag.servico ? `R$ ${ag.servico.preco.toFixed(2)}` : "R$ 0,00",
    })
  );

  const totalVisits = client.agendamentos ? client.agendamentos.length : 0;
  const lastVisit =
    client.agendamentos && client.agendamentos.length > 0
      ? new Date(
          client.agendamentos[client.agendamentos.length - 1].dataHora
        ).toLocaleDateString("pt-BR")
      : "-";

  const totalSpent = (client.agendamentos || []).reduce(
    (acc, ag) => acc + (ag.servico?.preco || 0),
    0
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Ver Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perfil do Cliente</DialogTitle>
          <DialogDescription>
            Informações completas e histórico de visitas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header com informações básicas */}
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {client.nome
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground">
                {client.nome}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cliente desde{" "}
                {new Date(client.createdAt || Date.now()).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="px-4 py-2 rounded-lg bg-primary/20">
                <p className="text-xs text-muted-foreground">
                  Total de Visitas
                </p>
                <p className="text-2xl font-bold text-primary text-center">
                  {totalVisits}
                </p>
              </div>
            </div>
          </div>

          {/* Informações de contato */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="font-medium text-foreground">
                    {client.telefone}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{client.email}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{totalVisits}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Visitas Total
              </p>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{lastVisit}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Última Visita
              </p>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Scissors className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">
                R$ {totalSpent.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Gasto</p>
            </Card>
          </div>

          {/* Histórico de agendamentos */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Histórico de Agendamentos
            </h4>
            {appointmentHistory.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum agendamento encontrado
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointmentHistory.map((appointment, index) => (
                  <Card
                    key={index}
                    className="p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10">
                          <span className="text-xs font-medium text-muted-foreground">
                            Data
                          </span>
                          <span className="text-sm font-bold text-primary">
                            {appointment.date}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {appointment.service}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Barbeiro: {appointment.barber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {appointment.value}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setOpen(false)}>Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
