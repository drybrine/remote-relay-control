import { Power, PowerOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onAllOn: () => void;
  onAllOff: () => void;
  onReset: () => void;
}

const QuickActions = ({ onAllOn, onAllOff, onReset }: QuickActionsProps) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <Button
        onClick={onAllOn}
        className="bg-success/20 text-success hover:bg-success/30 border border-success/30"
      >
        <Power className="w-4 h-4 mr-2" />
        Nyalakan Semua
      </Button>
      <Button
        onClick={onAllOff}
        variant="outline"
        className="border-destructive/30 text-destructive hover:bg-destructive/10"
      >
        <PowerOff className="w-4 h-4 mr-2" />
        Matikan Semua
      </Button>
      <Button
        onClick={onReset}
        variant="outline"
        className="border-border text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};

export default QuickActions;
