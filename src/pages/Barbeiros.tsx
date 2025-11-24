import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import type { Barbeiro } from "@/types";
import { Phone, Mail } from "lucide-react";
import { AdicionarBarbeiro } from "@/components/forms/AdicionarBarbeiro";
import { DetalhesBarbeiro } from "@/components/forms/DetalhesBarbeiro";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Barbeiros = () => {
  const [barbers, setBarbers] = useState<Barbeiro[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBarbers = async () => {
    try {
      const data = await api.barbeiros.getAll();
      setBarbers(data);
    } catch (error: unknown) {
      toast.error("Erro ao carregar barbeiros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBarbers();
  }, []);

  const handleUpdateBarber = async (
    id: number,
    data: Record<string, unknown>
  ) => {
    try {
      await api.barbeiros.update(id, data);
      toast.success("Barbeiro atualizado com sucesso!");
      loadBarbers();
    } catch (error: unknown) {
      toast.error("Erro ao atualizar barbeiro");
    }
  };

  const handleDeleteBarber = async (id: number) => {
    try {
      await api.barbeiros.delete(id);
      toast.success("Barbeiro removido com sucesso!");
      loadBarbers();
    } catch (error: unknown) {
      toast.error("Erro ao remover barbeiro");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Barbeiros</h1>
            <p className="text-muted-foreground">Gerencie sua equipe</p>
          </div>
          <AdicionarBarbeiro onSuccess={loadBarbers} />
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map((barber) => (
              <Card key={barber.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {barber.nome
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {barber.nome}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {barber.especialidade || "Barbeiro"}
                      </p>
                    </div>
                  </div>
                  {barber.rating && (
                    <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      ⭐ {barber.rating}
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{barber.telefone}</span>
                  </div>
                  {barber.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{barber.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    {barber.agendamentos?.length || 0} agendamentos
                  </p>
                  <DetalhesBarbeiro
                    barber={barber}
                    onUpdate={handleUpdateBarber}
                    onDelete={handleDeleteBarber}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Barbeiros;
