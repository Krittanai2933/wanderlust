
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { satsToFiat, fiatToSats, formatSats, formatFiat } from '@/utils/bitcoinUtils';

interface SatsFiatConverterProps {
  initialAmount?: number;
  onSatsChange?: (sats: number) => void;
  className?: string;
}

export const SatsFiatConverter: React.FC<SatsFiatConverterProps> = ({
  initialAmount = 1000,
  onSatsChange,
  className = '',
}) => {
  const [satsAmount, setSatsAmount] = useState<number>(initialAmount);
  const [fiatAmount, setFiatAmount] = useState<number>(satsToFiat(initialAmount));
  const [currency, setCurrency] = useState<string>('USD');
  
  // Update fiat when sats change
  const handleSatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSats = parseInt(e.target.value) || 0;
    setSatsAmount(newSats);
    setFiatAmount(satsToFiat(newSats, currency));
    
    if (onSatsChange) {
      onSatsChange(newSats);
    }
  };
  
  // Update sats when fiat changes
  const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiat = parseFloat(e.target.value) || 0;
    setFiatAmount(newFiat);
    const newSats = fiatToSats(newFiat, currency);
    setSatsAmount(newSats);
    
    if (onSatsChange) {
      onSatsChange(newSats);
    }
  };
  
  return (
    <Card className={`p-4 ${className}`}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="sats-input">Satoshis</Label>
          <Input
            id="sats-input"
            type="number"
            min="0"
            value={satsAmount}
            onChange={handleSatsChange}
            className="text-right"
          />
          <p className="text-sm text-muted-foreground text-right">
            {formatSats(satsAmount)}
          </p>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="fiat-input">USD Amount</Label>
          <Input
            id="fiat-input"
            type="number"
            min="0"
            step="0.01"
            value={fiatAmount.toFixed(2)}
            onChange={handleFiatChange}
            className="text-right"
          />
          <p className="text-sm text-muted-foreground text-right">
            {formatFiat(fiatAmount, currency)}
          </p>
        </div>
      </div>
    </Card>
  );
};
