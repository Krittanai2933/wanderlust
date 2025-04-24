import { useState, useEffect, useCallback } from 'react';
import { requestProvider, WebLNProvider } from 'webln';
import { useToast } from '@/components/ui/use-toast';
import { fetchLnurlPayRequest } from '@/utils/lightningAddress';

interface UseWebLNReturn {
  webln: WebLNProvider | null;
  isEnabled: boolean;
  isLoading: boolean;
  error: string | null;
  enableWebLN: () => Promise<WebLNProvider | null>;
  sendPayment: (paymentRequest: string) => Promise<any>;
  makeInvoice: (amount: number, memo?: string) => Promise<string>;
  sendTip: (amount: number) => Promise<any>;
}

const LIGHTNING_ADDRESS = "righttech@getalby.com";

export const useWebLN = (): UseWebLNReturn => {
  const [webln, setWebln] = useState<WebLNProvider | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const enableWebLN = useCallback(async (): Promise<WebLNProvider | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const provider = await requestProvider();
      setWebln(provider);
      setIsEnabled(true);
      toast({
        title: "WebLN Connected",
        description: "Your Lightning wallet is now connected.",
      });
      return provider;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to WebLN';
      setError(errorMessage);
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const payLightningAddress = useCallback(async (amount: number, memo?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Resolve invoice for righttech@getalby.com
      const { pr } = await fetchLnurlPayRequest(LIGHTNING_ADDRESS, amount, memo);
      // 2. Send payment via WebLN
      const provider = webln || (await enableWebLN());
      if (!provider) throw new Error("WebLN provider not available");
      const response = await provider.sendPayment(pr);
      toast({
        title: "Payment Sent",
        description: `Successfully paid ${amount} sats to ${LIGHTNING_ADDRESS}`,
      });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment to Lightning Address failed';
      setError(errorMessage);
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [webln, enableWebLN, toast]);

  const sendPayment = useCallback(async (paymentRequest: string) => {
    if (!webln) {
      const newProvider = await enableWebLN();
      if (!newProvider) return null;
    }
    
    try {
      const response = await webln!.sendPayment(paymentRequest);
      toast({
        title: "Payment Sent",
        description: "Your payment was successful!",
      });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  }, [webln, enableWebLN, toast]);

  const makeInvoice = useCallback(async (amount: number, memo?: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const { pr } = await fetchLnurlPayRequest(LIGHTNING_ADDRESS, amount, memo);
      return pr;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate payment request';
      setError(errorMessage);
      toast({
        title: "Invoice Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return '';
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const sendTip = useCallback(async (amount: number) => {
    return payLightningAddress(amount, 'Tip for awesome travel content');
  }, [payLightningAddress]);

  useEffect(() => {
    // Check if WebLN is available in the browser
    if (typeof window !== 'undefined' && 'webln' in window) {
      setIsEnabled(true);
    }
  }, []);

  return {
    webln,
    isEnabled,
    isLoading,
    error,
    enableWebLN,
    sendPayment,
    makeInvoice,
    sendTip,
  };
};
