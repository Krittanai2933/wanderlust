
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  onDonateClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title = "Exploring the World with Bitcoin",
  subtitle = "Join me on my adventures while I travel the globe, funded by Bitcoin Lightning",
  imageSrc = "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  onDonateClick,
}) => {
  return (
    <div className="relative w-full h-[50vh] mb-12 overflow-hidden rounded-lg">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center p-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8">
          {subtitle}
        </p>
        {onDonateClick && (
          <Button 
            onClick={onDonateClick}
            className="bitcoin-gradient w-fit"
            size="lg"
          >
            Support My Journey
          </Button>
        )}
      </div>
    </div>
  );
};
