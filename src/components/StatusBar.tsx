import { Wifi, WifiOff, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  isConnected: boolean;
  activeRelays: number;
  totalRelays: number;
}

const StatusBar = ({ isConnected, activeRelays, totalRelays }: StatusBarProps) => {
  return (
    <div className="glass-card rounded-xl p-4 mb-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-success pulse-animation" : "bg-destructive"
              )}
            />
            {isConnected ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive" />
            )}
            <span className="text-sm text-muted-foreground">
              {isConnected ? "Terhubung" : "Terputus"}
            </span>
          </div>

          {/* Active Relays */}
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm">
              <span className="text-primary font-mono font-bold">{activeRelays}</span>
              <span className="text-muted-foreground">/{totalRelays} Aktif</span>
            </span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground font-mono">
          Update terakhir: {new Date().toLocaleTimeString("id-ID")}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
