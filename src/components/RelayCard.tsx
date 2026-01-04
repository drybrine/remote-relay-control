import { Switch } from "@/components/ui/switch";
import { Power, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RelayCardProps {
  id: number;
  name: string;
  isOn: boolean;
  onToggle: (id: number) => void;
  description?: string;
}

const RelayCard = ({ id, name, isOn, onToggle, description }: RelayCardProps) => {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 transition-all duration-500 animate-fade-in",
        isOn && "border-success/30 glow-success"
      )}
      style={{ animationDelay: `${id * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300",
              isOn
                ? "bg-success/20 text-success"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isOn ? (
              <Zap className="w-6 h-6" />
            ) : (
              <Power className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className={cn("led-indicator", isOn ? "led-on" : "led-off")} />
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-mono uppercase tracking-wider",
              isOn ? "text-success" : "text-muted-foreground"
            )}
          >
            {isOn ? "AKTIF" : "MATI"}
          </span>
        </div>
        <Switch
          variant="relay"
          size="xl"
          checked={isOn}
          onCheckedChange={() => onToggle(id)}
        />
      </div>
    </div>
  );
};

export default RelayCard;
