
import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { TravelGallery } from '@/components/TravelGallery';
import { HeroBanner } from '@/components/HeroBanner';
import { travelPhotos } from '@/data/travelPhotos';
import { useWebLN } from '@/hooks/useWebLN';
import { useScrollPayment } from '@/hooks/useScrollPayment';

const Index = () => {
  const { isEnabled } = useWebLN();
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [autoPayAmount, setAutoPayAmount] = useState(1); // 1 sat default

  // Ref for scroll-to-pay at the top (HeroBanner area)
  const topRef = useRef<HTMLDivElement>(null);

  // Use scroll payment only at the top of the page now
  useScrollPayment(topRef, {
    enabled: autoPayEnabled && isEnabled,
    amount: autoPayAmount,
    cooldownPeriod: 2000, // Reduced to 2 seconds
    threshold: 75, // 75% visible
  });

  // Removed donation/settings sidebar, state is managed here and passed down to Navbar
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        autoPayEnabled={autoPayEnabled}
        onAutoPayChange={setAutoPayEnabled}
        autoPayAmount={autoPayAmount}
        onAutoPayAmountChange={setAutoPayAmount}
      />
      <main className="flex-1 container py-8">
        {/* Attach topRef here to trigger scroll-to-pay */}
        <div ref={topRef}>
          <HeroBanner onDonateClick={() => {}} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Travel Memories</h2>
            <TravelGallery 
              photos={travelPhotos} 
              enableAutoPayment={false}
              paymentAmount={autoPayAmount}
            />
          </div>
          {/* Removed sidebar donation/settings cards */}
          <div className="space-y-6"></div>
        </div>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} Wanderlust Bitcoin Adventures. Powered by the Bitcoin Lightning Network.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
