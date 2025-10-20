import { Button } from "@/components/ui/button";
import { 
  LogIn, 
  Coffee, 
  CupSoda, 
  LogOut 
} from "lucide-react";

type SessionStatus = "working" | "breakfast" | "snack" | "finished" | "idle";

interface TimeEntryButtonsProps {
  status: SessionStatus;
  onStartSession: () => void;
  onStartBreakfast: () => void;
  onEndBreakfast: () => void;
  onStartSnack: () => void;
  onEndSnack: () => void;
  onEndSession: () => void;
  hasBreakfastStart: boolean;
  hasBreakfastEnd: boolean;
  hasSnackStart: boolean;
  hasSnackEnd: boolean;
}

export function TimeEntryButtons({
  status,
  onStartSession,
  onStartBreakfast,
  onEndBreakfast,
  onStartSnack,
  onEndSnack,
  onEndSession,
  hasBreakfastStart,
  hasBreakfastEnd,
  hasSnackStart,
  hasSnackEnd,
}: TimeEntryButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Button
        size="lg"
        className="h-auto py-4 flex flex-col gap-2"
        disabled={status !== "idle"}
        onClick={onStartSession}
        data-testid="button-start-session"
      >
        <LogIn className="h-6 w-6" />
        <span className="text-base font-semibold">Entrada</span>
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="h-auto py-4 flex flex-col gap-2"
        disabled={status !== "working" || hasBreakfastStart}
        onClick={onStartBreakfast}
        data-testid="button-start-breakfast"
      >
        <Coffee className="h-6 w-6" />
        <span className="text-base font-semibold">Inicio Desayuno</span>
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="h-auto py-4 flex flex-col gap-2"
        disabled={status !== "breakfast" || !hasBreakfastStart || hasBreakfastEnd}
        onClick={onEndBreakfast}
        data-testid="button-end-breakfast"
      >
        <Coffee className="h-6 w-6" />
        <span className="text-base font-semibold">Fin Desayuno</span>
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="h-auto py-4 flex flex-col gap-2"
        disabled={status !== "working" || hasSnackStart}
        onClick={onStartSnack}
        data-testid="button-start-snack"
      >
        <CupSoda className="h-6 w-6" />
        <span className="text-base font-semibold">Inicio Merienda</span>
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="h-auto py-4 flex flex-col gap-2"
        disabled={status !== "snack" || !hasSnackStart || hasSnackEnd}
        onClick={onEndSnack}
        data-testid="button-end-snack"
      >
        <CupSoda className="h-6 w-6" />
        <span className="text-base font-semibold">Fin Merienda</span>
      </Button>

      <Button
        size="lg"
        variant="destructive"
        className="h-auto py-4 flex flex-col gap-2"
        disabled={status === "idle" || status === "finished"}
        onClick={onEndSession}
        data-testid="button-end-session"
      >
        <LogOut className="h-6 w-6" />
        <span className="text-base font-semibold">Finalizar Jornada</span>
      </Button>
    </div>
  );
}
