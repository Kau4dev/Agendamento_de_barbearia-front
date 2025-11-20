import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, X, UserPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const notifications = [
  {
    id: 1,
    type: "new",
    title: "Novo Agendamento",
    description: "João Silva agendou para hoje às 14:00",
    time: "5 min atrás",
    icon: Calendar,
  },
  {
    id: 2,
    type: "cancel",
    title: "Agendamento Cancelado",
    description: "Pedro Santos cancelou o agendamento das 10:00",
    time: "1 hora atrás",
    icon: X,
  },
  {
    id: 3,
    type: "new",
    title: "Novo Agendamento",
    description: "Lucas Oliveira agendou para amanhã às 09:00",
    time: "2 horas atrás",
    icon: Calendar,
  },
  {
    id: 4,
    type: "client",
    title: "Novo Cliente",
    description: "Rafael Lima foi cadastrado no sistema",
    time: "3 horas atrás",
    icon: UserPlus,
  },
];

export const NotificationsSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notificações</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
