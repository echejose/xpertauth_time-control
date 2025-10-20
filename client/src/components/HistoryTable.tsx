import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { WorkSession } from "@shared/schema";

interface HistoryTableProps {
  sessions: WorkSession[];
}

function formatMinutesToTime(minutes: number | null): string {
  if (minutes === null || minutes === 0) return "-";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function formatTime(date: Date | string | null): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "HH:mm", { locale: es });
}

export function HistoryTable({ sessions }: HistoryTableProps) {
  const now = new Date();

  const filterSessions = (range: "week" | "month" | "year") => {
    let start: Date;
    let end: Date;

    switch (range) {
      case "week":
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case "year":
        start = startOfYear(now);
        end = endOfYear(now);
        break;
    }

    return sessions.filter((session) => {
      const sessionDate = parseISO(session.date);
      return sessionDate >= start && sessionDate <= end;
    });
  };

  const renderTable = (filteredSessions: WorkSession[]) => {
    if (filteredSessions.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground" data-testid="text-empty-state">
          <p className="text-lg">No hay registros en este período</p>
          <p className="text-sm mt-2">Los registros aparecerán aquí una vez que finalices una jornada</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Salida</TableHead>
              <TableHead>Desayuno</TableHead>
              <TableHead>Merienda</TableHead>
              <TableHead className="text-right">Horas Totales</TableHead>
              <TableHead className="text-right">Pausas</TableHead>
              <TableHead className="text-right font-semibold">Tiempo Real</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSessions.map((session) => (
              <TableRow key={session.id} data-testid={`row-session-${session.id}`}>
                <TableCell className="font-medium">
                  {format(parseISO(session.date), "dd/MM/yyyy", { locale: es })}
                </TableCell>
                <TableCell>{formatTime(session.startTime)}</TableCell>
                <TableCell>{formatTime(session.endTime)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {session.breakfastStart && session.breakfastEnd
                    ? `${formatTime(session.breakfastStart)} - ${formatTime(session.breakfastEnd)}`
                    : "-"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {session.snackStart && session.snackEnd
                    ? `${formatTime(session.snackStart)} - ${formatTime(session.snackEnd)}`
                    : "-"}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatMinutesToTime(session.totalWorkMinutes)}
                </TableCell>
                <TableCell className="text-right font-mono text-chart-2">
                  {formatMinutesToTime(session.totalBreakMinutes)}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-primary">
                  {formatMinutesToTime(session.actualWorkMinutes)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="week" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Historial de Registros</h2>
          <TabsList>
            <TabsTrigger value="week" data-testid="tab-week">Semanal</TabsTrigger>
            <TabsTrigger value="month" data-testid="tab-month">Mensual</TabsTrigger>
            <TabsTrigger value="year" data-testid="tab-year">Anual</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="week" data-testid="content-week">
          {renderTable(filterSessions("week"))}
        </TabsContent>

        <TabsContent value="month" data-testid="content-month">
          {renderTable(filterSessions("month"))}
        </TabsContent>

        <TabsContent value="year" data-testid="content-year">
          {renderTable(filterSessions("year"))}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
