import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Scissors, Calendar, Clock, Trash2 } from "lucide-react";

interface Appointment {
  id: number;
  time: string;
  client: string;
  barber: string;
  service: string;
  status: string;
}

interface DetalhesAgendamentoProps {
  appointment: Appointment;
  onUpdate: (id: number, data: Partial<Appointment>) => void;
  onDelete: (id: number) => void;
}

export const DetalhesAgendamento = ({
  appointment,
  onUpdate,
  onDelete,
}: DetalhesAgendamentoProps) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    client: appointment.client,
    time: appointment.time,
    barber: appointment.barber,
    service: appointment.service,
    status: appointment.status,
  });

  useEffect(() => {
    setFormData({
      client: appointment.client,
      time: appointment.time,
      barber: appointment.barber,
      service: appointment.service,
      status: appointment.status,
    });
  }, [appointment]);

  const handleSave = () => {
    onUpdate(appointment.id, formData);
    toast({
      title: "Agendamento atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    setIsEditing(false);
    setOpen(false);
  };

  const handleDelete = () => {
    onDelete(appointment.id);
    toast({
      title: "Agendamento excluído",
      description: "O agendamento foi removido com sucesso.",
      variant: "destructive",
    });
    setShowDeleteDialog(false);
    setOpen(false);
  };

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
              {isEditing
                ? "Edite as informações do agendamento"
                : "Informações completas do agendamento"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                {isEditing ? (
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData({ ...formData, client: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium">{appointment.client}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Horário</Label>
                {isEditing ? (
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">{appointment.time}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="barber">Barbeiro</Label>
                {isEditing ? (
                  <Select
                    value={formData.barber}
                    onValueChange={(value) =>
                      setFormData({ ...formData, barber: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Carlos">Carlos</SelectItem>
                      <SelectItem value="Roberto">Roberto</SelectItem>
                      <SelectItem value="André">André</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium">{appointment.barber}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Serviço</Label>
                {isEditing ? (
                  <Select
                    value={formData.service}
                    onValueChange={(value) =>
                      setFormData({ ...formData, service: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corte">Corte</SelectItem>
                      <SelectItem value="Barba">Barba</SelectItem>
                      <SelectItem value="Corte + Barba">Corte + Barba</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <Scissors className="w-4 h-4 text-primary" />
                    <span className="font-medium">{appointment.service}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {isEditing ? (
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "confirmed"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              {isEditing ? (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        client: appointment.client,
                        time: appointment.time,
                        barber: appointment.barber,
                        service: appointment.service,
                        status: appointment.status,
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={handleSave}>
                    Salvar Alterações
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>Editar</Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
