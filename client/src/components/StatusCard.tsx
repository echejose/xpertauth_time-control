import { Card } from "@/components/ui/card";
import { Clock, Coffee, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

type SessionStatus = "working" | "breakfast" | "snack" | "finished" | "idle";

interface StatusCardProps {
  status: SessionStatus;
  startTime?: Date;
}

export function StatusCard({ status, startTime }: StatusCardProps) {
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  useEffect(() => {
    if (!startTime || status === "idle" || status === "finished") {
      setElapsedTime("00:00:00");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsedTime(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, status]);

  const getStatusConfig = () => {
    switch (status) {
      case "working":
        return {
          text: "Trabajando",
          icon: Clock,
          borderColor: "border-l-primary",
          bgColor: "bg-primary/5",
          iconColor: "text-primary",
        };
      case "breakfast":
        return {
          text: "En Pausa - Desayuno",
          icon: Coffee,
          borderColor: "border-l-chart-2",
          bgColor: "bg-chart-2/5",
          iconColor: "text-chart-2",
        };
      case "snack":
        return {
          text: "En Pausa - Merienda",
          icon: Coffee,
          borderColor: "border-l-chart-2",
          bgColor: "bg-chart-2/5",
          iconColor: "text-chart-2",
        };
      case "finished":
        return {
          text: "Jornada Finalizada",
          icon: CheckCircle2,
          borderColor: "border-l-muted-foreground",
          bgColor: "bg-muted",
          iconColor: "text-muted-foreground",
        };
      default:
        return {
          text: "Sin Jornada Activa",
          icon: Clock,
          borderColor: "border-l-border",
          bgColor: "bg-muted/50",
          iconColor: "text-muted-foreground",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className={`border-l-4 ${config.borderColor} ${config.bgColor}`} data-testid="card-status">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
            <h2 className="text-xl font-semibold" data-testid="text-status">
              {config.text}
            </h2>
          </div>
        </div>
        <div className="text-4xl font-mono font-bold tracking-tight" data-testid="text-elapsed-time">
          {elapsedTime}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {status === "idle" ? "Registra tu entrada para comenzar" : "Tiempo transcurrido"}
        </p>
      </div>
    </Card>
  );
}
