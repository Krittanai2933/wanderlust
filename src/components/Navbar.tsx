
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useWebLN } from '@/hooks/useWebLN';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BitcoinDonation } from '@/components/BitcoinDonation';
import { BitcoinSettings } from '@/components/BitcoinSettings';
import { Bitcoin, SlidersHorizontal } from 'lucide-react';

interface NavbarProps {
  autoPayEnabled: boolean;
  onAutoPayChange: (enabled: boolean) => void;
  autoPayAmount: number;
  onAutoPayAmountChange: (amount: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  autoPayEnabled,
  onAutoPayChange,
  autoPayAmount,
  onAutoPayAmountChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isEnabled, enableWebLN } = useWebLN();

  // Dialog open state management
  const [openDonate, setOpenDonate] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1vdW50YWluLXNub3ciPjxwYXRoIGQ9Im04IDMgNCAxMSA1LTUgNSAxNUg0bDQtMTEiLz48L3N2Zz4="
            alt="Logo"
            width={24}
            height={24}
            className="text-bitcoin"
          />
          <h1 className="text-lg font-bold">Wanderlust Bitcoin Adventures</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Donate Button */}
          <Dialog open={openDonate} onOpenChange={setOpenDonate}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Donate (Bitcoin)">
                <Bitcoin className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Donate with Bitcoin Lightning</DialogTitle>
              </DialogHeader>
              <BitcoinDonation />
            </DialogContent>
          </Dialog>
          {/* Scroll to Pay (Settings) Button */}
          <Dialog open={openSettings} onOpenChange={setOpenSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Scroll to Pay Settings">
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scroll to Pay Settings</DialogTitle>
              </DialogHeader>
              <BitcoinSettings 
                autoPayEnabled={autoPayEnabled}
                onAutoPayChange={onAutoPayChange}
                autoPayAmount={autoPayAmount}
                onAutoPayAmountChange={onAutoPayAmountChange}
              />
            </DialogContent>
          </Dialog>
          {!isEnabled ? (
            <Button variant="outline" size="sm" onClick={enableWebLN}>
              Connect Wallet
            </Button>
          ) : null}
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
