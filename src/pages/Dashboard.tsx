import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Users,
  Scissors,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { DashboardStats } from "@/types";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setError(false);
      const data = await api.dashboard.getStats();
      setStats(data);
    } catch (error) {
      setError(true);
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = stats
    ? [
        {
          title: "Total de Agendamentos",
          value: stats.totalAgendamentos.toString(),
          icon: Calendar,
          trend: "Agendamentos futuros",
        },
        {
          title: "Total de Clientes",
          value: stats.totalClientes.toString(),
          icon: Users,
          trend: "Total cadastrado",
        },
        {
          title: "Barbeiros Ativos",
          value: stats.barbeirosAtivos.toString(),
          icon: Scissors,
          trend: "Disponíveis",
        },
        {
          title: "Receita Mensal",
          value: `R$ ${stats.receitaMensal.toFixed(2)}`,
          icon: TrendingUp,
          trend: "Este mês",
        },
      ]
    : [];
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>

        {loading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-6 space-y-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-3 w-20" />
                </Card>
              ))}
            </div>
            <Card className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            </Card>
          </>
        ) : error ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <h3 className="text-lg font-semibold">
                  Erro ao carregar dados
                </h3>
                <p className="text-sm text-muted-foreground">
                  Não foi possível carregar as estatísticas
                </p>
              </div>
              <button
                onClick={loadStats}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <Card
                  key={index}
                  className="p-6 space-y-3 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">
                      {stat.value}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </Card>
              ))}
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Próximos Agendamentos
              </h2>
              {!stats?.proximosAgendamentos ||
              stats.proximosAgendamentos.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum agendamento próximo
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.proximosAgendamentos.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {appointment.client
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {appointment.client}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.service}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {appointment.date}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {appointment.time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.barber}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
