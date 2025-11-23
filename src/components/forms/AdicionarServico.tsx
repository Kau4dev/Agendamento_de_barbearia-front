import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}

interface AdicionarServicoProps {
  service?: Service;
  onSave: (service: Omit<Service, 'id'> & { id?: number }) => void;
  trigger?: React.ReactNode;
}

export const AdicionarServico = ({ service, onSave, trigger }: AdicionarServicoProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: ""
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration.toString()
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: ""
      });
    }
  }, [service, open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const serviceData = {
      id: service?.id,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration)
    };
    
    onSave(serviceData);
    
    toast({
      title: service ? "Serviço atualizado!" : "Serviço adicionado!",
      description: `${formData.name} foi ${service ? "atualizado" : "adicionado ao catálogo"}.`,
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
          <DialogTitle>{service ? "Editar Serviço" : "Adicionar Serviço"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Serviço</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Ex: Corte Degradê" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Descreva o serviço..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              step="0.01" 
              placeholder="0,00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Input 
              id="duration" 
              name="duration" 
              type="number" 
              placeholder="30"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required 
            />
          </div>
          
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{service ? "Salvar" : "Adicionar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};