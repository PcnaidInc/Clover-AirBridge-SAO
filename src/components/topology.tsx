import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tablet, Smartphone, Wifi, ArrowRight } from "lucide-react";

const DeviceCard = ({ icon, title, description, connections }: { icon: React.ReactNode, title: string, description: string, connections: React.ReactNode }) => (
  <Card className="flex-1 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 w-full md:w-auto">
    <CardHeader>
      <div className="mx-auto bg-secondary p-4 rounded-full w-fit">
        {icon}
      </div>
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground min-h-[40px] text-sm">{description}</p>
      <div className="flex justify-center items-center gap-4 mt-4 text-sm text-muted-foreground">
        {connections}
      </div>
    </CardContent>
  </Card>
);

const Connection = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex flex-col items-center justify-center py-4 md:py-0 md:px-2">
    <div className="flex flex-col items-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1 text-accent my-2">
        {icon}
      </div>
      <ArrowRight className="w-8 h-8 text-muted-foreground/30 hidden md:block" />
      <svg width="2" height="32" className="text-muted-foreground/30 md:hidden" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="0" x2="1" y2="32" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/></svg>
    </div>
  </div>
);

export default function Topology() {
  return (
    <div className="bg-card p-6 md:p-8 rounded-xl border">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2">
        <DeviceCard
          icon={<Tablet className="w-10 h-10 text-accent" />}
          title="Clover Station Solo"
          description="POS UI, order entry, hosts AirBridge app as a custom tender."
          connections={
            <div className="flex items-center gap-2"><Wifi className="w-4 h-4"/> LAN</div>
          }
        />

        <Connection
          icon={<Wifi className="w-6 h-6" />}
          label="WSS"
        />

        <DeviceCard
          icon={<Smartphone className="w-10 h-10 text-accent" />}
          title="Clover Flex 4"
          description="Card-present terminal, runs SNPD server."
           connections={
             <div className="flex items-center gap-2"><Wifi className="w-4 h-4"/> LAN</div>
          }
        />
      </div>
      <p className="text-center mt-6 text-muted-foreground text-sm">Both devices must be on the same local area network (e.g., store Wi-Fi). The AirBridge app on the Station Solo communicates directly with the Flex via WSS.</p>
    </div>
  );
}