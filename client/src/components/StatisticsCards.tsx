import { Card } from "@/components/ui/card";
import { Clock, Coffee, Briefcase } from "lucide-react";

interface StatisticsCardsProps {
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  actualWorkMinutes: number;
}

function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function StatisticsCards({
  totalWorkMinutes,
  totalBreakMinutes,
  actualWorkMinutes,
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Horas Totales</h3>
        </div>
        <p className="text-3xl font-bold font-mono" data-testid="text-total-hours">
          {formatMinutesToTime(totalWorkMinutes)}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Desde entrada hasta salida
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-chart-2/10 rounded-md">
            <Coffee className="h-5 w-5 text-chart-2" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Tiempo en Pausas</h3>
        </div>
        <p className="text-3xl font-bold font-mono" data-testid="text-break-time">
          {formatMinutesToTime(totalBreakMinutes)}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Desayuno y merienda
        </p>
      </Card>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/20 rounded-md">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium text-primary">Tiempo Real de Trabajo</h3>
        </div>
        <p className="text-3xl font-bold font-mono text-primary" data-testid="text-actual-work">
          {formatMinutesToTime(actualWorkMinutes)}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Tiempo efectivo trabajado
        </p>
      </Card>
    </div>
  );
}
