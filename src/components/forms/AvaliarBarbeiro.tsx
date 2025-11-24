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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface AvaliarBarbeiroProps {
  barbeiroId: number;
  barbeiroNome: string;
  agendamentoId?: number;
  onSuccess?: () => void;
}

export const AvaliarBarbeiro = ({
  barbeiroId,
  barbeiroNome,
  agendamentoId,
  onSuccess,
}: AvaliarBarbeiroProps) => {
  const [open, setOpen] = useState(false);
  const [nota, setNota] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nota === 0) {
      toast.error("Por favor, selecione uma nota");
      return;
    }

    setLoading(true);
    try {
      await api.avaliacoes.criar(barbeiroId, {
        nota,
        comentario: comentario.trim() || undefined,
        agendamentoId,
      });

      toast.success("Avaliação enviada com sucesso!");
      setOpen(false);
      setNota(0);
      setComentario("");
      onSuccess?.();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao enviar avaliação";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Star className="w-4 h-4 mr-2" />
          Avaliar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar {barbeiroNome}</DialogTitle>
          <DialogDescription>
            Compartilhe sua experiência com este barbeiro
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Sua avaliação</Label>
            <div className="flex gap-2 justify-center py-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setNota(value)}
                  onMouseEnter={() => setHoverNota(value)}
                  onMouseLeave={() => setHoverNota(0)}
                  className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= (hoverNota || nota)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {nota > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {nota === 1 && "Muito insatisfeito"}
                {nota === 2 && "Insatisfeito"}
                {nota === 3 && "Regular"}
                {nota === 4 && "Satisfeito"}
                {nota === 5 && "Muito satisfeito"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentario">Comentário (opcional)</Label>
            <Textarea
              id="comentario"
              placeholder="Conte-nos sobre sua experiência..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comentario.length}/500 caracteres
            </p>
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
            <Button type="submit" disabled={loading || nota === 0}>
              {loading ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
