import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { StatusCard } from "@/components/StatusCard";
import { TimeEntryButtons } from "@/components/TimeEntryButtons";
import { StatisticsCards } from "@/components/StatisticsCards";
import { HistoryTable } from "@/components/HistoryTable";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { WorkSession } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

type SessionStatus = "working" | "breakfast" | "snack" | "finished" | "idle";

export default function Home() {
  const { toast } = useToast();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const { data: todaySession, isLoading: loadingToday } = useQuery<WorkSession | null>({
    queryKey: ["/api/sessions/today"],
  });

  const { data: allSessions = [], isLoading: loadingSessions, error: sessionsError } = useQuery<WorkSession[]>({
    queryKey: ["/api/sessions"],
  });

  useEffect(() => {
    if (sessionsError) {
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los registros históricos. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  }, [sessionsError, toast]);

  useEffect(() => {
    if (todaySession && !todaySession.endTime) {
      setCurrentSessionId(todaySession.id);
    } else {
      setCurrentSessionId(null);
    }
  }, [todaySession]);

  const startSessionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/sessions/start", {});
    },
    onSuccess: (data: WorkSession) => {
      setCurrentSessionId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/sessions/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      toast({
        title: "Jornada iniciada",
        description: "Tu jornada laboral ha comenzado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo iniciar la jornada",
        variant: "destructive",
      });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      return await apiRequest("PATCH", `/api/sessions/${id}/${action}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la sesión",
        variant: "destructive",
      });
    },
  });

  const handleStartSession = () => {
    startSessionMutation.mutate();
  };

  const handleStartBreakfast = () => {
    if (!currentSessionId) return;
    updateSessionMutation.mutate(
      { id: currentSessionId, action: "breakfast-start" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/sessions/today"] });
          queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
          toast({
            title: "Desayuno iniciado",
            description: "Disfruta tu pausa",
          });
        },
      }
    );
  };

  const handleEndBreakfast = () => {
    if (!currentSessionId) return;
    updateSessionMutation.mutate(
      { id: currentSessionId, action: "breakfast-end" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/sessions/today"] });
          queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
          toast({
            title: "Desayuno finalizado",
            description: "De vuelta al trabajo",
          });
        },
      }
    );
  };

  const handleStartSnack = () => {
    if (!currentSessionId) return;
    updateSessionMutation.mutate(
      { id: currentSessionId, action: "snack-start" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/sessions/today"] });
          queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
          toast({
            title: "Merienda iniciada",
            description: "Disfruta tu pausa",
          });
        },
      }
    );
  };

  const handleEndSnack = () => {
    if (!currentSessionId) return;
    updateSessionMutation.mutate(
      { id: currentSessionId, action: "snack-end" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/sessions/today"] });
          queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
          toast({
            title: "Merienda finalizada",
            description: "De vuelta al trabajo",
          });
        },
      }
    );
  };

  const handleEndSession = () => {
    if (!currentSessionId) return;
    updateSessionMutation.mutate(
      { id: currentSessionId, action: "end" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/sessions/today"] });
          queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
          setCurrentSessionId(null);
          toast({
            title: "Jornada finalizada",
            description: "Tu jornada ha sido registrada correctamente",
          });
        },
      }
    );
  };

  const getStatus = (): SessionStatus => {
    if (!todaySession || todaySession.endTime) return "idle";
    if (todaySession.status === "finished") return "finished";
    if (todaySession.breakfastStart && !todaySession.breakfastEnd) return "breakfast";
    if (todaySession.snackStart && !todaySession.snackEnd) return "snack";
    return "working";
  };

  const calculateStats = () => {
    if (!todaySession?.startTime) {
      return { totalWorkMinutes: 0, totalBreakMinutes: 0, actualWorkMinutes: 0 };
    }

    const endTime = todaySession.endTime ? new Date(todaySession.endTime) : new Date();
    const totalMinutes = Math.floor(
      (endTime.getTime() - new Date(todaySession.startTime).getTime()) / (1000 * 60)
    );

    let breakMinutes = 0;
    if (todaySession.breakfastStart && todaySession.breakfastEnd) {
      breakMinutes += Math.floor(
        (new Date(todaySession.breakfastEnd).getTime() - new Date(todaySession.breakfastStart).getTime()) / (1000 * 60)
      );
    }
    if (todaySession.snackStart && todaySession.snackEnd) {
      breakMinutes += Math.floor(
        (new Date(todaySession.snackEnd).getTime() - new Date(todaySession.snackStart).getTime()) / (1000 * 60)
      );
    }

    return {
      totalWorkMinutes: totalMinutes,
      totalBreakMinutes: breakMinutes,
      actualWorkMinutes: totalMinutes - breakMinutes,
    };
  };

  const status = getStatus();
  const stats = calculateStats();
  const startTime = todaySession?.startTime ? new Date(todaySession.startTime) : undefined;

  if (loadingToday) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando sesión actual...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <StatusCard status={status} startTime={startTime} />

        <TimeEntryButtons
          status={status}
          onStartSession={handleStartSession}
          onStartBreakfast={handleStartBreakfast}
          onEndBreakfast={handleEndBreakfast}
          onStartSnack={handleStartSnack}
          onEndSnack={handleEndSnack}
          onEndSession={handleEndSession}
          hasBreakfastStart={!!todaySession?.breakfastStart}
          hasBreakfastEnd={!!todaySession?.breakfastEnd}
          hasSnackStart={!!todaySession?.snackStart}
          hasSnackEnd={!!todaySession?.snackEnd}
        />

        <StatisticsCards
          totalWorkMinutes={stats.totalWorkMinutes}
          totalBreakMinutes={stats.totalBreakMinutes}
          actualWorkMinutes={stats.actualWorkMinutes}
        />

        {loadingSessions ? (
          <Card className="p-12 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando historial de registros...</p>
          </Card>
        ) : (
          <HistoryTable sessions={allSessions} />
        )}
      </div>
    </div>
  );
}
