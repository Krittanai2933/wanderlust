
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { formatSats } from '@/utils/bitcoinUtils';

interface BitcoinSettingsProps {
  autoPayEnabled: boolean;
  onAutoPayChange: (enabled: boolean) => void;
  autoPayAmount: number;
  onAutoPayAmountChange: (amount: number) => void;
  className?: string;
}

export const BitcoinSettings: React.FC<BitcoinSettingsProps> = ({
  autoPayEnabled,
  onAutoPayChange,
  autoPayAmount,
  onAutoPayAmountChange,
  className = '',
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Bitcoin Settings</CardTitle>
        <CardDescription>
          Configure how you'd like to support my travels with Bitcoin Lightning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="auto-pay-toggle">Auto-pay on scroll</Label>
            <p className="text-sm text-muted-foreground">
              Automatically send a small tip when viewing travel photos
            </p>
          </div>
          <Switch
            id="auto-pay-toggle"
            checked={autoPayEnabled}
            onCheckedChange={onAutoPayChange}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-pay-amount">Auto-pay amount</Label>
            <span className="text-sm font-medium">
              {formatSats(autoPayAmount)}
            </span>
          </div>
          <Slider
            id="auto-pay-amount"
            disabled={!autoPayEnabled}
            value={[autoPayAmount]}
            min={1}
            max={100}
            step={1}
            onValueChange={(values) => onAutoPayAmountChange(values[0])}
          />
          <p className="text-xs text-muted-foreground">
            Adjust how many sats to tip per photo view (1-100 sats)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
