
declare module 'webln' {
  export interface WebLNProvider {
    enable(): Promise<void>;
    getInfo(): Promise<{ node: { alias: string; pubkey: string } }>;
    sendPayment(paymentRequest: string): Promise<{ preimage: string }>;
    makeInvoice(args: { amount: number; defaultMemo?: string }): Promise<{ paymentRequest: string }>;
    signMessage(message: string): Promise<{ signature: string }>;
    verifyMessage(signature: string, message: string): Promise<{ valid: boolean }>;
  }

  export function requestProvider(): Promise<WebLNProvider>;
}

interface Window {
  webln?: import('webln').WebLNProvider;
}
