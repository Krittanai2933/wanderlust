
/**
 * Utility functions to resolve a Lightning Address (e.g., someone@getalby.com)
 * and fetch an invoice via LNURL-pay protocol.
 */

export async function fetchLnurlPayRequest(lightningAddress: string, sats: number, comment?: string): Promise<{ pr: string; successAction: any }> {
  // 1. Discover lnurl endpoint
  const [name, domain] = lightningAddress.split("@");
  if (!name || !domain) throw new Error("Invalid Lightning Address");
  const wellKnownUrl = `https://${domain}/.well-known/lnurlp/${name}`;
  const res = await fetch(wellKnownUrl);
  if (!res.ok) throw new Error("Could not fetch LNURL pay endpoint information");
  const lnurlMeta = await res.json();

  // 2. Request invoice for amount (amount in msats)
  const callbackUrl = lnurlMeta.callback;
  const msats = sats * 1000;
  const params = new URLSearchParams({ amount: msats.toString() });
  if (comment && lnurlMeta.commentAllowed > 0) {
    params.set("comment", comment.slice(0, lnurlMeta.commentAllowed));
  }
  const payRes = await fetch(`${callbackUrl}?${params.toString()}`);
  const payData = await payRes.json();
  if (!payData.pr) throw new Error("No payment request received from LNURL pay server");
  return { pr: payData.pr, successAction: payData.successAction };
}
