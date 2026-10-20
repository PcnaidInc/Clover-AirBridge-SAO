import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, ExternalLink } from "lucide-react";

export default function Resources() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Downloads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild variant="secondary" className="w-full justify-between">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <span>AirBridge APK (latest release)</span>
              <Download />
            </a>
          </Button>
          <Button asChild variant="secondary" className="w-full justify-between">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <span>Secure Network Pay Display (App Market)</span>
              <ExternalLink />
            </a>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Compliance Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild variant="secondary" className="w-full justify-between">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <span>Clover SDK EULA</span>
              <FileText />
            </a>
          </Button>
          <Button asChild variant="secondary" className="w-full justify-between">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <span>SNPD PCI-P2PE Attestation</span>
              <FileText />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}