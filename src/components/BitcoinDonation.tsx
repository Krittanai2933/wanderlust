
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SatsFiatConverter } from './SatsFiatConverter';
import { useWebLN } from '@/hooks/useWebLN';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';

interface BitcoinDonationProps {
  title?: string;
  description?: string;
  className?: string;
}

export const BitcoinDonation: React.FC<BitcoinDonationProps> = ({
  title = "Support My Travels",
  description = "Your support helps fund my next adventure. Thank you!",
  className = '',
}) => {
  const [donationAmount, setDonationAmount] = useState<number>(1000); // Default 1000 sats
  const [invoice, setInvoice] = useState<string>('');
  const [showQR, setShowQR] = useState<boolean>(false);
  const { isEnabled, enableWebLN, makeInvoice, isLoading, sendPayment } = useWebLN();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDonationAmountChange = (sats: number) => {
    setDonationAmount(sats);
    setInvoice('');
    setShowQR(false);
  };

  // Handle Connect Wallet button (if not connected)
  const handleConnectWallet = async () => {
    try {
      await enableWebLN();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to your Bitcoin wallet.",
        variant: "destructive",
      });
    }
  };

  // Handler for Donate (try extension first, then fallback to QR)
  const handleDonate = async () => {
    setIsGenerating(true);
    setInvoice('');
    setShowQR(false);

    try {
      // 1. Try to generate invoice (always needed since both QR and WebLN need paymentRequest)
      const paymentRequest = await makeInvoice(donationAmount, 'Travel donation');
      if (!paymentRequest) {
        toast({
          title: "Error",
          description: "Could not create invoice. Check Lightning address.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // 2. If WebLN available, try to pay with extension
      if (isEnabled) {
        try {
          await sendPayment(paymentRequest);
          toast({
            title: "Thank you!",
            description: "Donation sent via your Lightning wallet.",
            // Success styling
          });
          setIsGenerating(false);
          setInvoice('');
          setShowQR(false);
          return;
        } catch (error) {
          // Fallback to QR code if payment fails
          toast({
            title: "Extension Payment Failed",
            description: "You can still donate by scanning the QR code.",
            variant: "destructive",
          });
          setInvoice(paymentRequest);
          setShowQR(true);
          setIsGenerating(false);
        }
      } else {
        // If WebLN not enabled, show QR directly
        setInvoice(paymentRequest);
        setShowQR(true);
        setIsGenerating(false);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to prepare donation. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-xs mb-2">
            All payments are sent to <span className="font-bold">righttech@getalby.com</span>
          </p>
          <SatsFiatConverter 
            initialAmount={donationAmount} 
            onSatsChange={handleDonationAmountChange}
          />
        </div>

        <div className="flex gap-2">
          {!isEnabled ? (
            <Button 
              onClick={handleConnectWallet} 
              className="w-full bitcoin-gradient"
              disabled={isGenerating}
            >
              {isGenerating ? "Connecting..." : "Connect Bitcoin Wallet"}
            </Button>
          ) : (
            <Button 
              onClick={handleDonate}
              className="w-full bitcoin-gradient"
              disabled={isGenerating || donationAmount <= 0}
            >
              {isGenerating ? "Processing..." : "Donate with Lightning"}
            </Button>
          )}
        </div>

        {showQR && invoice && (
          <div className="mt-4 p-4 border rounded-lg bg-black/5 flex flex-col items-center">
            <div className="bg-white p-2 rounded-lg mb-2">
              <QRCodeSVG value={invoice} size={200} />
            </div>
            <p className="text-xs mt-2 text-muted-foreground break-all">
              {invoice.substring(0, 30)}...
            </p>
            <p className="text-xs text-yellow-700 mt-2">Scan with your Lightning wallet if browser payment did not work.</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Payments are processed via the Lightning Network to righttech@getalby.com.
        </p>
      </CardFooter>
    </Card>
  );
};

