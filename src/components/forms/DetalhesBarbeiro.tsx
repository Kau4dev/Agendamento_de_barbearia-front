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
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, Star, Calendar, Trash2 } from "lucide-react";

interface Barber {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  appointments: number;
  rating: number;
}

interface DetalhesBarbeiroProps {
  barber: Barber;
  onUpdate: (id: number, data: Partial<Barber>) => void;
  onDelete: (id: number) => void;
}

export const DetalhesBarbeiro = ({
  barber,
  onUpdate,
  onDelete,
}: DetalhesBarbeiroProps) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: barber.name,
    specialty: barber.specialty,
    phone: barber.phone,
    email: barber.email,
  });

  useEffect(() => {
    setFormData({
      name: barber.name,
      specialty: barber.specialty,
      phone: barber.phone,
      email: barber.email,
    });
  }, [barber]);

  const handleSave = () => {
    onUpdate(barber.id, formData);
    toast({
      title: "Barbeiro atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    setIsEditing(false);
    setOpen(false);
  };

  const handleDelete = () => {
    onDelete(barber.id);
    toast({
      title: "Barbeiro removido",
      description: "O barbeiro foi removido da equipe.",
      variant: "destructive",
    });
    setShowDeleteDialog(false);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            Ver Detalhes
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Barbeiro</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edite as informações do barbeiro"
                : "Informações completas do barbeiro"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {barber.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nome completo"
                    />
                    <Input
                      value={formData.specialty}
                      onChange={(e) =>
                        setFormData({ ...formData, specialty: e.target.value })
                      }
                      placeholder="Especialidade"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-foreground">
                      {barber.name}
                    </h3>
                    <p className="text-muted-foreground">{barber.specialty}</p>
                  </>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="font-bold text-primary">{barber.rating}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefone</Label>
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="font-medium">{barber.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="font-medium">{barber.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">
                  Estatísticas do Mês
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm text-muted-foreground">Agendamentos</p>
                  <p className="text-2xl font-bold text-primary">
                    {barber.appointments}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avaliação</p>
                  <p className="text-2xl font-bold text-primary">{barber.rating}</p>
                </div>
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
                        name: barber.name,
                        specialty: barber.specialty,
                        phone: barber.phone,
                        email: barber.email,
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
                    Remover
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
            <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este barbeiro da equipe? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
