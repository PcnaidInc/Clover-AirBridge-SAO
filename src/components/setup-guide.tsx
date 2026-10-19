import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageSquare, Server, ShieldCheck, Wifi, Code, Zap, HardDrive, Cpu, Network, Usb } from 'lucide-react';

export default function SetupGuide() {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <Accordion type="single" collapsible className="w-full" defaultValue="item-2">
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">High-Level Transaction Timeline</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <p className="text-muted-foreground">This diagram shows the sequence of events for a typical transaction. All communication stays on the local network for a sub-second response time.</p>
              <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 text-center p-4 rounded-lg bg-secondary/50 border">
                <div className="flex flex-col items-center justify-center p-2">
                  <Server className="w-8 h-8 mb-2 text-accent"/>
                  <h3 className="font-semibold">POS (Station)</h3>
                  <p className="text-xs text-muted-foreground">Sends Sale Request</p>
                </div>
                <div className="flex items-center justify-center">
                   <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                </div>
                <div className="flex flex-col items-center justify-center p-2">
                  <MessageSquare className="w-8 h-8 mb-2 text-accent"/>
                  <h3 className="font-semibold">Mini (AirBridge)</h3>
                  <p className="text-xs text-muted-foreground">Mirrors Request</p>
                </div>
                 <div className="flex items-center justify-center">
                   <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                </div>
                <div className="flex flex-col items-center justify-center p-2">
                  <Wifi className="w-8 h-8 mb-2 text-accent"/>
                  <h3 className="font-semibold">Flex (SNPD)</h3>
                  <p className="text-xs text-muted-foreground">Takes Payment</p>
                </div>
              </div>
               <p className="text-sm text-center font-mono p-2 bg-muted rounded-md">POS ➔ Mini ➔ Flex ➔ Customer ➔ Flex ➔ Mini ➔ POS ➔ Printer</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">Software Stack on the Mini (Relay)</AccordionTrigger>
            <AccordionContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Layer</TableHead>
                    <TableHead>Library / Object</TableHead>
                    <TableHead>Function</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell><div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-muted-foreground"/>Android Service</div></TableCell><TableCell>RelayService</TableCell><TableCell>Starts in foreground, keeps both connectors alive.</TableCell></TableRow>
                  <TableRow><TableCell><div className="flex items-center gap-2"><Usb className="w-4 h-4 text-muted-foreground"/>USB Side</div></TableCell><TableCell>USBConnector + CloverDeviceObserver</TableCell><TableCell>Listens for requests from Station via OTG.</TableCell></TableRow>
                  <TableRow><TableCell><div className="flex items-center gap-2"><Network className="w-4 h-4 text-muted-foreground"/>LAN Side</div></TableCell><TableCell>CloverConnector with IPAddress...</TableCell><TableCell>Opens secure web-socket to the Flex.</TableCell></TableRow>
                  <TableRow><TableCell><div className="flex items-center gap-2"><Zap className="w-4 h-4 text-muted-foreground"/>Message Bridge</div></TableCell><TableCell>In-memory mapper</TableCell><TableCell>Converts and correlates messages between USB and LAN.</TableCell></TableRow>
                  <TableRow><TableCell><div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-muted-foreground"/>Secrets</div></TableCell><TableCell><code className="font-mono bg-muted p-1 rounded text-xs">BuildConfig.CLOVER_APP_ID</code></TableCell><TableCell>Authenticates Mini to Flex via Application ID.</TableCell></TableRow>
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">Clover Platform Touch-points</AccordionTrigger>
            <AccordionContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Interaction</TableHead>
                    <TableHead>API / Service</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow><TableCell>Device-to-device LAN</TableCell><TableCell>SNPD / REST Pay Display</TableCell><TableCell>Real-time card processing with full EMV stack.</TableCell></TableRow>
                    <TableRow><TableCell><Badge variant="outline">Optional</Badge> REST pull</TableCell><TableCell><code className="font-mono text-xs">/v3/merchants/../orders</code></TableCell><TableCell>For cloud dashboards or reconciliation.</TableCell></TableRow>
                    <TableRow><TableCell><Badge variant="outline">Optional</Badge> web-hooks</TableCell><TableCell><code className="font-mono text-xs">payment.created</code></TableCell><TableCell>Push notifications to your back-office without polling.</TableCell></TableRow>
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">Security Model</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-3">
              <div className="flex items-start gap-3"><ShieldCheck className="w-5 h-5 mt-1 text-green-600 flex-shrink-0"/><p>End-to-end encryption from EMV kernel on Flex to the payment gateway. The Mini never decrypts PAN/track data.</p></div>
              <div className="flex items-start gap-3"><Code className="w-5 h-5 mt-1 text-blue-600 flex-shrink-0"/><p>TLS secures communication within the store network. SNPD generates a dev cert; production requires a CA-signed certificate.</p></div>
              <div className="flex items-start gap-3"><Server className="w-5 h-5 mt-1 text-purple-600 flex-shrink-0"/><p>Remote Application ID is validated by Flex firmware, preventing unauthorized relay apps from connecting.</p></div>
              <div className="flex items-start gap-3"><Wifi className="w-5 h-5 mt-1 text-orange-600 flex-shrink-0"/><p>No firewall egress is required unless you enable optional cloud web-hooks for analytics.</p></div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">Failure & Recovery Scenarios</AccordionTrigger>
            <AccordionContent className="pt-4">
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Mini Behaviour</TableHead>
                    <TableHead>Merchant Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow><TableCell>Flex offline</TableCell><TableCell><code className="font-mono text-xs">onDeviceDisconnected()</code> fires → Mini replies Fail</TableCell><TableCell>Register shows &quot;Payment failed.&quot; Cashier can retry or use cash.</TableCell></TableRow>
                    <TableRow><TableCell>USB cable unplugged</TableCell><TableCell><code className="font-mono text-xs">onDeviceDisconnected()</code> fires on USB connector</TableCell><TableCell>Relay service remains alive; hot-plug cable to resume.</TableCell></TableRow>
                    <TableRow><TableCell>Mini reboots</TableCell><TableCell>Auto-start via <code className="font-mono text-xs">BOOT_COMPLETED</code></TableCell><TableCell>&quot;Pay Display Not Found&quot;; reconnects in ~20s.</TableCell></TableRow>
                    <TableRow><TableCell>LAN outage</TableCell><TableCell>Same as Flex offline</TableCell><TableCell>Relay fails fast; no duplicate authorizations.</TableCell></TableRow>
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">Deployment & Operations</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-3">
              <p><strong className="font-semibold text-foreground">Provisioning:</strong> Ship Minis preloaded with the APK and a kiosk launcher so staff cannot exit.</p>
              <p><strong className="font-semibold text-foreground">Remote updates:</strong> Use the Clover Device Manager MDM or your own F-Droid repo.</p>
              <p><strong className="font-semibold text-foreground">Metrics:</strong> Inject a call to <code className="font-mono text-xs">cloverConnector.retrieveDeviceStatus()</code> and POST to a monitoring service.</p>
              <p><strong className="font-semibold text-foreground">Scaling:</strong> One Mini can drive multiple Flex units by mapping connectors by IP address.</p>
              <p><strong className="font-semibold text-foreground">Compliance:</strong> Keep a signed copy of the Clover SDK EULA and SNPD PCI-P2PE attestation.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
