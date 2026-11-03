import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageSquare, ShieldCheck, Wifi, Code, Zap, HardDrive, Cpu, Network } from 'lucide-react';

export default function SetupGuide() {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <Accordion type="single" collapsible className="w-full" defaultValue="item-2">
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">High-Level Transaction Timeline</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <p className="text-muted-foreground">This diagram shows the sequence of events for a typical transaction. The AirBridge app runs on the Station Solo and communicates directly with the Flex over a local WSS connection.</p>
              <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 text-center p-4 rounded-lg bg-secondary/50 border">
                <div className="flex flex-col items-center justify-center p-2">
                  <HardDrive className="w-8 h-8 mb-2 text-accent"/>
                  <h3 className="font-semibold">Station (AirBridge)</h3>
                  <p className="text-xs text-muted-foreground">Sends Sale Request</p>
                </div>
                <div className="flex items-center justify-center">
                   <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                </div>
                <div className="flex flex-col items-center justify-center p-2">
                  <MessageSquare className="w-8 h-8 mb-2 text-accent"/>
                  <h3 className="font-semibold">Network (WSS)</h3>
                  <p className="text-xs text-muted-foreground">Secure WebSocket</p>
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
               <p className="text-sm text-center font-mono p-2 bg-muted rounded-md">Register App → AirBridge Tender → WSS Sale Request → Flex → Customer Payment → Sale Response → Register</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">Software Stack on the Station Solo</AccordionTrigger>
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
                  <TableRow><TableCell><div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-muted-foreground"/>Custom Tender</div></TableCell><TableCell>PaymentRelayActivity</TableCell><TableCell>Launched by Register app's tender selection, orchestrates payment flow.</TableCell></TableRow>
                  <TableRow><TableCell><div className="flex items-center gap-2"><Network className="w-4 h-4 text-muted-foreground"/>Order Access</div></TableCell><TableCell>OrderConnector (clover-android-sdk)</TableCell><TableCell>Fetches order total from local Clover services on the Station.</TableCell></TableRow>
                  <TableRow><TableCell><div className="flex items-center gap-2"><Wifi className="w-4 h-4 text-muted-foreground"/>Remote Pay</div></TableCell><TableCell>CloverConnector with WebSocketCloverDeviceConfiguration</TableCell><TableCell>Opens secure web-socket directly to the Flex.</TableCell></TableRow>
                  <TableRow><TableCell><div className="flex items-center gap-2"><Zap className="w-4 h-4 text-muted-foreground"/>Coroutines</div></TableCell><TableCell>CloverFlexManager (Kotlin coroutines)</TableCell><TableCell>Manages async connection lifecycle and sale response.</TableCell></TableRow>
                  <TableRow><TableCell><div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-muted-foreground"/>Authentication</div></TableCell><TableCell><code className="font-mono bg-muted p-1 rounded text-xs">AppConstants.REMOTE_APP_ID</code></TableCell><TableCell>Authenticates Station to Flex via Remote Application ID.</TableCell></TableRow>
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
                    <TableRow><TableCell>Device-to-device LAN</TableCell><TableCell>SNPD / Remote Pay Display</TableCell><TableCell>Real-time card processing with full EMV stack.</TableCell></TableRow>
                    <TableRow><TableCell><Badge variant="outline">Custom Tender</Badge> Intent</TableCell><TableCell><code className="font-mono text-xs">clover.intent.action.MERCHANT_TENDER</code></TableCell><TableCell>Register app launches AirBridge as a payment method.</TableCell></TableRow>
                    <TableRow><TableCell><Badge variant="outline">Optional</Badge> web-hooks</TableCell><TableCell><code className="font-mono text-xs">payment.created</code></TableCell><TableCell>Push notifications to your back-office without polling.</TableCell></TableRow>
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">Security Model</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-3">
              <div className="flex items-start gap-3"><ShieldCheck className="w-5 h-5 mt-1 text-green-600 flex-shrink-0"/><p>End-to-end encryption from EMV kernel on Flex to the payment gateway. The Station never decrypts PAN/track data.</p></div>
              <div className="flex items-start gap-3"><Code className="w-5 h-5 mt-1 text-blue-600 flex-shrink-0"/><p>TLS secures communication within the store network. SNPD generates a dev cert; production requires a CA-signed certificate.</p></div>
              <div className="flex items-start gap-3"><Wifi className="w-5 h-5 mt-1 text-purple-600 flex-shrink-0"/><p>Remote Application ID is validated by Flex firmware, preventing unauthorized apps from connecting.</p></div>
              <div className="flex items-start gap-3"><Network className="w-5 h-5 mt-1 text-orange-600 flex-shrink-0"/><p>No firewall egress is required unless you enable optional cloud web-hooks for analytics.</p></div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">Failure & Recovery Scenarios</AccordionTrigger>
            <AccordionContent className="pt-4">
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Station Behaviour</TableHead>
                    <TableHead>Merchant Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow><TableCell>Flex offline</TableCell><TableCell><code className="font-mono text-xs">onDeviceError()</code> fires → activity finishes with RESULT_CANCELED</TableCell><TableCell>Register shows "Payment failed." Cashier can retry or use cash.</TableCell></TableRow>
                    <TableRow><TableCell>Network outage</TableCell><TableCell>Same as Flex offline</TableCell><TableCell>Transaction fails fast; no duplicate authorizations.</TableCell></TableRow>
                    <TableRow><TableCell>Station reboots</TableCell><TableCell>App must be re-launched via Register tender</TableCell><TableCell>No auto-start; merchant re-opens order and re-selects tender.</TableCell></TableRow>
                    <TableRow><TableCell>Card declined</TableCell><TableCell><code className="font-mono text-xs">saleResponse.isSuccess() == false</code></TableCell><TableCell>Register returns to payment selection; order remains open.</TableCell></TableRow>
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">Deployment & Operations</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-3">
              <p><strong className="font-semibold text-foreground">Provisioning:</strong> Install from Clover App Market once, then sideload dev builds over ADB.</p>
              <p><strong className="font-semibold text-foreground">Configuration:</strong> Set FLEX_IP_ADDRESS and REMOTE_APP_ID in AppConstants.kt before building.</p>
              <p><strong className="font-semibold text-foreground">Monitoring:</strong> Inspect <code className="font-mono text-xs">adb logcat -s "CloverAirBridge"</code> for runtime diagnostics.</p>
              <p><strong className="font-semibold text-foreground">Compliance:</strong> Keep a signed copy of the Clover SDK EULA and SNPD PCI-P2PE attestation.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}