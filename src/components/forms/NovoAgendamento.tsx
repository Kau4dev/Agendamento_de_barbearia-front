import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Barbeiro, Servico, Cliente } from "@/types";
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
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { toast as sonnerToast } from "sonner";

interface NovoAgendamentoProps {
  onSuccess?: () => void;
}

export const NovoAgendamento = ({ onSuccess }: NovoAgendamentoProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedBarbeiro, setSelectedBarbeiro] = useState("");
  const [selectedServico, setSelectedServico] = useState("");
  const [selectedCliente, setSelectedCliente] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const [barbeirosData, servicosData, clientesData] = await Promise.all([
        api.barbeiros.getAll(),
        api.servicos.getAll(),
        api.clientes.getAll(),
      ]);
      setBarbeiros(barbeirosData);
      setServicos(servicosData);
      setClientes(clientesData);
    } catch (error) {
      sonnerToast.error("Erro ao carregar dados");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!selectedBarbeiro || !selectedServico || !selectedCliente) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const date = formData.get("date") as string;
      const time = formData.get("time") as string;
      const dataHora = new Date(`${date}T${time}`);

      // Validação: impedir agendamento no passado
      if (dataHora <= new Date()) {
        toast({
          title: "Data inválida",
          description: "Não é possível criar agendamentos no passado",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      await api.agendamentos.create({
        clienteId: parseInt(selectedCliente),
        barbeiroId: parseInt(selectedBarbeiro),
        servicoId: parseInt(selectedServico),
        dataHora: dataHora.toISOString(),
      });

      toast({
        title: "Agendamento criado!",
        description: `Agendamento criado com sucesso`,
      });

      setOpen(false);
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao criar agendamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente</Label>
            <Select
              name="cliente"
              value={selectedCliente}
              onValueChange={setSelectedCliente}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id.toString()}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              name="date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Horário</Label>
            <Input id="time" name="time" type="time" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barber">Barbeiro</Label>
            <Select
              name="barber"
              value={selectedBarbeiro}
              onValueChange={setSelectedBarbeiro}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o barbeiro" />
              </SelectTrigger>
              <SelectContent>
                {barbeiros.map((barbeiro) => (
                  <SelectItem key={barbeiro.id} value={barbeiro.id.toString()}>
                    {barbeiro.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Serviço</Label>
            <Select
              name="service"
              value={selectedServico}
              onValueChange={setSelectedServico}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {servicos.map((servico) => (
                  <SelectItem key={servico.id} value={servico.id.toString()}>
                    {servico.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Agendamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
