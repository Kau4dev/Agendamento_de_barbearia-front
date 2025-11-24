import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";

interface Notification {
  id: string;
  type: "new" | "cancel" | "client";
  title: string;
  description: string;
  time: string;
  icon: typeof Calendar;
}

export const NotificationsSheet = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTime, setLastReadTime] = useState<number>(() => {
    const saved = localStorage.getItem("notificationsLastRead");
    return saved ? parseInt(saved) : Date.now();
  });

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24)
      return `${diffHours} hora${diffHours > 1 ? "s" : ""} atrás`;
    return `${diffDays} dia${diffDays > 1 ? "s" : ""} atrás`;
  };

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const notificacoesData = await api.notificacoes.getRecentes();

        const notifs: Notification[] = notificacoesData.map((notif) => ({
          id: `notif-${notif.id}`,
          type: notif.tipo === "CANCELAMENTO" ? "cancel" : "new",
          title: notif.titulo,
          description: notif.mensagem,
          time: formatTimeAgo(notif.createdAt),
          icon: notif.tipo === "CANCELAMENTO" ? XCircle : Calendar,
        }));

        setNotifications(notifs);

        if (!open) {
          const unread = notificacoesData.filter(
            (notif) => new Date(notif.createdAt).getTime() > lastReadTime
          ).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [lastReadTime, open]);

  useEffect(() => {
    if (open) {
      const now = Date.now();
      setLastReadTime(now);
      localStorage.setItem("notificationsLastRead", now.toString());
      setUnreadCount(0);
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notificações</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando notificações...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma notificação no momento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.type === "cancel"
                            ? "bg-destructive/20"
                            : "bg-primary/20"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            notification.type === "cancel"
                              ? "text-destructive"
                              : "text-primary"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
