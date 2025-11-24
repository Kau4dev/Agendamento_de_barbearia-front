import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import type { Servico } from "@/types";

interface AdicionarServicoProps {
  service?: Servico;
  onSave: (service: Omit<Servico, "id"> & { id?: number }) => void;
  trigger?: React.ReactNode;
}

export const AdicionarServico = ({
  service,
  onSave,
  trigger,
}: AdicionarServicoProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    duracao: "",
  });

  useEffect(() => {
    if (service) {
      setFormData({
        nome: service.nome,
        descricao: service.descricao,
        preco: service.preco.toString(),
        duracao: service.duracao.toString(),
      });
    } else {
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        duracao: "",
      });
    }
  }, [service, open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const serviceData = {
      id: service?.id,
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      duracao: parseInt(formData.duracao),
    };

    await onSave(serviceData);

    toast({
      title: service ? "Serviço atualizado!" : "Serviço adicionado!",
      description: `${formData.nome} foi ${
        service ? "atualizado" : "adicionado ao catálogo"
      }.`,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Serviço
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar Serviço" : "Adicionar Serviço"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Serviço</Label>
            <Input
              id="nome"
              name="nome"
              placeholder="Ex: Corte Degradê"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              placeholder="Descreva o serviço..."
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco">Preço (R$)</Label>
            <Input
              id="preco"
              name="preco"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={formData.preco}
              onChange={(e) =>
                setFormData({ ...formData, preco: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duracao">Duração (minutos)</Label>
            <Input
              id="duracao"
              name="duracao"
              type="number"
              placeholder="30"
              value={formData.duracao}
              onChange={(e) =>
                setFormData({ ...formData, duracao: e.target.value })
              }
              required
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">{service ? "Salvar" : "Adicionar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
