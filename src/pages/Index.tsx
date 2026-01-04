import { useState } from "react";
import Header from "@/components/Header";
import StatusBar from "@/components/StatusBar";
import QuickActions from "@/components/QuickActions";
import RelayCard from "@/components/RelayCard";
import { useToast } from "@/hooks/use-toast";

interface Relay {
  id: number;
  name: string;
  isOn: boolean;
  description: string;
}

const initialRelays: Relay[] = [
  { id: 1, name: "Relay 1", isOn: false, description: "Lampu Ruang Tamu" },
  { id: 2, name: "Relay 2", isOn: true, description: "Pompa Air" },
  { id: 3, name: "Relay 3", isOn: false, description: "AC Kamar" },
  { id: 4, name: "Relay 4", isOn: false, description: "Lampu Taman" },
  { id: 5, name: "Relay 5", isOn: true, description: "Kipas Exhaust" },
  { id: 6, name: "Relay 6", isOn: false, description: "Heater" },
  { id: 7, name: "Relay 7", isOn: false, description: "Motor Gate" },
  { id: 8, name: "Relay 8", isOn: false, description: "CCTV Power" },
];

const Index = () => {
  const [relays, setRelays] = useState<Relay[]>(initialRelays);
  const [isConnected] = useState(true);
  const { toast } = useToast();

  const handleToggle = (id: number) => {
    setRelays((prev) =>
      prev.map((relay) =>
        relay.id === id ? { ...relay, isOn: !relay.isOn } : relay
      )
    );

    const relay = relays.find((r) => r.id === id);
    if (relay) {
      toast({
        title: relay.isOn ? "Relay Dimatikan" : "Relay Dinyalakan",
        description: `${relay.name} (${relay.description}) ${relay.isOn ? "OFF" : "ON"}`,
      });
    }
  };

  const handleAllOn = () => {
    setRelays((prev) => prev.map((relay) => ({ ...relay, isOn: true })));
    toast({
      title: "Semua Relay Aktif",
      description: "Semua relay telah dinyalakan",
    });
  };

  const handleAllOff = () => {
    setRelays((prev) => prev.map((relay) => ({ ...relay, isOn: false })));
    toast({
      title: "Semua Relay Mati",
      description: "Semua relay telah dimatikan",
    });
  };

  const handleReset = () => {
    setRelays(initialRelays);
    toast({
      title: "Reset Berhasil",
      description: "Semua relay dikembalikan ke kondisi awal",
    });
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
          <p className="mt-1 font-mono">v1.0.0</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
