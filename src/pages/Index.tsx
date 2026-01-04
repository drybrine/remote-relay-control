import { useState, useEffect } from "react";
import Header from "@/components/Header";
import StatusBar from "@/components/StatusBar";
import QuickActions from "@/components/QuickActions";
import RelayCard from "@/components/RelayCard";
import { useToast } from "@/hooks/use-toast";
import { subscribeToRelayStatus, setRelayStatus, initializeRelayData, type RelayStatus } from "@/lib/relayService";

interface Relay {
  id: number;
  name: string;
  isOn: boolean;
  description: string;
}

const initialRelays: Relay[] = [
  { id: 1, name: "Relay 1", isOn: false, description: "ESP32 GPIO 14" },
];

const Index = () => {
  const [relays, setRelays] = useState<Relay[]>(initialRelays);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<RelayStatus | null>(null);
  const { toast } = useToast();

  // Initialize Firebase and subscribe to changes
  useEffect(() => {
    // Initialize relay data
    initializeRelayData();

    // Subscribe to relay status changes
    const unsubscribe = subscribeToRelayStatus((status, data) => {
      setRelays((prev) =>
        prev.map((relay) =>
          relay.id === 1 ? { ...relay, isOn: status } : relay
        )
      );
      setDeviceInfo(data);
      setIsConnected(data.deviceOnline || false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggle = async (id: number) => {
    const relay = relays.find((r) => r.id === id);
    if (!relay) return;

    const newStatus = !relay.isOn;

    try {
      // Update Firebase
      await setRelayStatus(newStatus);
      
      // Optimistically update UI
      setRelays((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isOn: newStatus } : r
        )
      );

      toast({
        title: newStatus ? "Relay Dinyalakan" : "Relay Dimatikan",
        description: `${relay.name} (${relay.description}) ${newStatus ? "ON" : "OFF"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah status relay",
        variant: "destructive",
      });
      console.error("Error toggling relay:", error);
    }
  };

  const handleAllOn = async () => {
    try {
      await setRelayStatus(true);
      toast({
        title: "Relay Aktif",
        description: "Relay telah dinyalakan",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyalakan relay",
        variant: "destructive",
      });
    }
  };

  const handleAllOff = async () => {
    try {
      await setRelayStatus(false);
      toast({
        title: "Relay Mati",
        description: "Relay telah dimatikan",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mematikan relay",
        variant: "destructive",
      });
    }
  };

  const handleReset = async () => {
    try {
      await setRelayStatus(false);
      toast({
        title: "Reset Berhasil",
        description: "Relay dikembalikan ke kondisi OFF",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mereset relay",
        variant: "destructive",
      });
    }
  };

  const activeRelays = relays.filter((r) => r.isOn).length;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <StatusBar
          isConnected={isConnected}
          activeRelays={activeRelays}
          totalRelays={relays.length}
        />

        {deviceInfo && deviceInfo.device && (
          <div className="mb-6 p-4 bg-card rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">Device Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>IP Address: <span className="font-mono">{deviceInfo.device.deviceIP}</span></div>
              <div>RSSI: <span className="font-mono">{deviceInfo.device.rssi} dBm</span></div>
              <div>Uptime: <span className="font-mono">{Math.floor(deviceInfo.device.uptime / 60)} min</span></div>
              <div>Free Heap: <span className="font-mono">{Math.floor(deviceInfo.device.freeHeap / 1024)} KB</span></div>
            </div>
          </div>
        )}

        <QuickActions
          onAllOn={handleAllOn}
          onAllOff={handleAllOff}
          onReset={handleReset}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {relays.map((relay) => (
            <RelayCard
              key={relay.id}
              id={relay.id}
              name={relay.name}
              isOn={relay.isOn}
              onToggle={handleToggle}
              description={relay.description}
            />
          ))}
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>RelayControl IoT Dashboard © 2026</p>
          <p className="mt-1 font-mono">v1.0.0 - Firebase Edition</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
