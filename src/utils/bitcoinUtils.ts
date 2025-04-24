
export const satoshisToBTC = (sats: number): number => {
  return sats / 100000000;
};

export const btcToSatoshis = (btc: number): number => {
  return btc * 100000000;
};

// Exchange rate API (we'll use a fixed rate for demo purposes)
// In a real app, you'd fetch the current exchange rate
const SATS_TO_USD_RATE = 0.00034; // Example rate: 1 sat = $0.00034 USD

export const satsToFiat = (sats: number, currency: string = 'USD'): number => {
  switch (currency.toUpperCase()) {
    case 'USD':
      return sats * SATS_TO_USD_RATE;
    // Add more currencies as needed
    default:
      return sats * SATS_TO_USD_RATE;
  }
};

export const fiatToSats = (fiat: number, currency: string = 'USD'): number => {
  switch (currency.toUpperCase()) {
    case 'USD':
      return fiat / SATS_TO_USD_RATE;
    // Add more currencies as needed
    default:
      return fiat / SATS_TO_USD_RATE;
  }
};

export const formatSats = (sats: number): string => {
  return sats.toLocaleString() + ' sats';
};

export const formatFiat = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
