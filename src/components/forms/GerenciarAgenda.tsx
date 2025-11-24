import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface GerenciarAgendaProps {
  barbeiroId: number;
  barbeiroNome: string;
}

interface AgendaData {
  id: number;
  barbeiroId: number;
  seg_inicio: string | null;
  seg_fim: string | null;
  ter_inicio: string | null;
  ter_fim: string | null;
  qua_inicio: string | null;
  qua_fim: string | null;
  qui_inicio: string | null;
  qui_fim: string | null;
  sex_inicio: string | null;
  sex_fim: string | null;
  sab_inicio: string | null;
  sab_fim: string | null;
  dom_inicio: string | null;
  dom_fim: string | null;
}

const diasSemana = [
  { key: "seg", label: "Segunda-feira" },
  { key: "ter", label: "Terça-feira" },
  { key: "qua", label: "Quarta-feira" },
  { key: "qui", label: "Quinta-feira" },
  { key: "sex", label: "Sexta-feira" },
  { key: "sab", label: "Sábado" },
  { key: "dom", label: "Domingo" },
];

export const GerenciarAgenda = ({
  barbeiroId,
  barbeiroNome,
}: GerenciarAgendaProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agenda, setAgenda] = useState<AgendaData | null>(null);

  useEffect(() => {
    const loadAgenda = async () => {
      setLoading(true);
      try {
        const data = await api.agenda.getByBarbeiroId(barbeiroId);
        setAgenda(data);
      } catch (error) {
        toast.error("Erro ao carregar agenda");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadAgenda();
    }
  }, [open, barbeiroId]);

  const handleSave = async () => {
    if (!agenda) return;

    setLoading(true);
    try {
      await api.agenda.update(barbeiroId, {
        seg_inicio: agenda.seg_inicio || null,
        seg_fim: agenda.seg_fim || null,
        ter_inicio: agenda.ter_inicio || null,
        ter_fim: agenda.ter_fim || null,
        qua_inicio: agenda.qua_inicio || null,
        qua_fim: agenda.qua_fim || null,
        qui_inicio: agenda.qui_inicio || null,
        qui_fim: agenda.qui_fim || null,
        sex_inicio: agenda.sex_inicio || null,
        sex_fim: agenda.sex_fim || null,
        sab_inicio: agenda.sab_inicio || null,
        sab_fim: agenda.sab_fim || null,
        dom_inicio: agenda.dom_inicio || null,
        dom_fim: agenda.dom_fim || null,
      });

      toast.success("Agenda atualizada com sucesso!");
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao salvar agenda");
    } finally {
      setLoading(false);
    }
  };

  const updateHorario = (
    dia: string,
    campo: "inicio" | "fim",
    valor: string
  ) => {
    if (!agenda) return;
    setAgenda({
      ...agenda,
      [`${dia}_${campo}`]: valor || null,
    });
  };

  const aplicarParaTodos = () => {
    if (!agenda || !agenda.seg_inicio || !agenda.seg_fim) {
      toast.error("Defina o horário de segunda-feira primeiro");
      return;
    }

    setAgenda({
      ...agenda,
      ter_inicio: agenda.seg_inicio,
      ter_fim: agenda.seg_fim,
      qua_inicio: agenda.seg_inicio,
      qua_fim: agenda.seg_fim,
      qui_inicio: agenda.seg_inicio,
      qui_fim: agenda.seg_fim,
      sex_inicio: agenda.seg_inicio,
      sex_fim: agenda.seg_fim,
      sab_inicio: agenda.seg_inicio,
      sab_fim: agenda.seg_fim,
    });

    toast.success("Horário aplicado para todos os dias úteis");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock className="w-4 h-4" />
          Gerenciar Agenda
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Agenda de {barbeiroNome}
          </DialogTitle>
          <DialogDescription>
            Configure os horários de atendimento para cada dia da semana
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando agenda...
          </div>
        ) : agenda ? (
          <div className="space-y-4 py-4">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={aplicarParaTodos}
              >
                Aplicar seg. para todos
              </Button>
            </div>

            {diasSemana.map(({ key, label }) => {
              const inicio = agenda[`${key}_inicio` as keyof AgendaData] as
                | string
                | null;
              const fim = agenda[`${key}_fim` as keyof AgendaData] as
                | string
                | null;

              return (
                <div
                  key={key}
                  className="grid grid-cols-[150px,1fr,1fr] gap-4 items-center p-3 rounded-lg border"
                >
                  <Label className="font-semibold">{label}</Label>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Início
                    </Label>
                    <Input
                      type="time"
                      value={inicio || ""}
                      onChange={(e) =>
                        updateHorario(key, "inicio", e.target.value)
                      }
                      placeholder="--:--"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Fim</Label>
                    <Input
                      type="time"
                      value={fim || ""}
                      onChange={(e) =>
                        updateHorario(key, "fim", e.target.value)
                      }
                      placeholder="--:--"
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Salvando..." : "Salvar Agenda"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Erro ao carregar agenda
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
