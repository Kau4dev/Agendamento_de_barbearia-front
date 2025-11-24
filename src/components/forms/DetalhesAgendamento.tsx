import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Scissors, Clock, Trash2 } from "lucide-react";
import type { Agendamento } from "@/types";
import { api } from "@/lib/api";
import { AvaliarBarbeiro } from "./AvaliarBarbeiro";

interface DetalhesAgendamentoProps {
  appointment: Agendamento;
  onUpdate?: () => void;
  onDelete: (id: number) => void;
}

export const DetalhesAgendamento = ({
  appointment,
  onUpdate,
  onDelete,
}: DetalhesAgendamentoProps) => {
  const [open, setOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [selectedStatus, setSelectedStatus] = useState(appointment.status);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await api.agendamentos.updateStatus(
        appointment.id,
        newStatus as "PENDENTE" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO"
      );
      setSelectedStatus(newStatus);
      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      });
      if (onUpdate) onUpdate();
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    onDelete(appointment.id);
    setShowDeleteDialog(false);
    setOpen(false);
  };

  const dataHora = new Date(appointment.dataHora);
  const horario = dataHora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const data = dataHora.toLocaleDateString("pt-BR");

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Detalhes
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <DialogDescription>
              Informações completas do agendamento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Cliente */}
              <div className="space-y-2">
                <Label>Cliente</Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {appointment.cliente?.nome || "Cliente"}
                  </span>
                </div>
              </div>

              {/* Data e Horário */}
              <div className="space-y-2">
                <Label>Data e Horário</Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {data} às {horario}
                  </span>
                </div>
              </div>

              {/* Barbeiro */}
              <div className="space-y-2">
                <Label>Barbeiro</Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {appointment.barbeiro?.nome || "Barbeiro"}
                  </span>
                </div>
              </div>

              {/* Serviço */}
              <div className="space-y-2">
                <Label>Serviço</Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <Scissors className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {appointment.servico?.nome || "Serviço"}
                  </span>
                </div>
              </div>

              {/* Preço */}
              {appointment.servico?.preco && (
                <div className="space-y-2">
                  <Label>Preço</Label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <span className="font-medium">
                      R$ {appointment.servico.preco.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Status - Editável */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={handleStatusChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                    <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botão de Avaliação - só aparece se status for CONCLUIDO */}
            {selectedStatus === "CONCLUIDO" && appointment.barbeiro && (
              <div className="pt-4 border-t">
                <AvaliarBarbeiro
                  barbeiroId={appointment.barbeiroId}
                  barbeiroNome={appointment.barbeiro.nome || "Barbeiro"}
                  agendamentoId={appointment.id}
                  onSuccess={() => {
                    toast({
                      title: "Sucesso",
                      description: "Avaliação enviada! Obrigado pelo feedback.",
                    });
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
