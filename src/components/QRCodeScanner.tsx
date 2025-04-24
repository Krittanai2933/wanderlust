
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWebLN } from '@/hooks/useWebLN';
import { useToast } from '@/components/ui/use-toast';

export const QRCodeScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [open, setOpen] = useState(false);
  const [invoice, setInvoice] = useState('');
  const webcamRef = useRef<Webcam>(null);
  const { sendPayment } = useWebLN();
  const { toast } = useToast();

  const scanQRCode = async () => {
    setIsScanning(true);
    
    // Simple timer to simulate QR code scanning
    // In a real app, you'd use a library like jsQR to detect and decode QR codes from the webcam
    setTimeout(() => {
      // Pretend we found a QR code
      toast({
        title: "QR Code Found",
        description: "Processing Lightning invoice...",
      });
      
      setInvoice("lnbc100n1p...");  // This would be the actual scanned invoice
      setIsScanning(false);
    }, 3000);
  };

  const handlePayInvoice = async () => {
    if (!invoice) {
      toast({
        title: "Error",
        description: "No invoice found. Please scan again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendPayment(invoice);
      setOpen(false);
      setInvoice('');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Scan Lightning QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Lightning Invoice</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {!isScanning ? (
            <Button onClick={scanQRCode}>
              Start Scanning
            </Button>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-dashed border-white opacity-50 pointer-events-none" />
            </div>
          )}
          
          {invoice && (
            <div className="mt-4">
              <p className="text-sm mb-2">Found invoice: {invoice.substring(0, 20)}...</p>
              <Button onClick={handlePayInvoice}>
                Pay Invoice
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
