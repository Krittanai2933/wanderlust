
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGalleryScrollPayment } from '@/hooks/useGalleryScrollPayment';

export interface TravelPhoto {
  id: string;
  src: string;
  title: string;
  location: string;
  description: string;
}

interface TravelGalleryProps {
  photos: TravelPhoto[];
  enableAutoPayment?: boolean;
  paymentAmount?: number;
  className?: string;
}

export const TravelGallery: React.FC<TravelGalleryProps> = ({
  photos,
  enableAutoPayment = false,
  paymentAmount = 1,
  className = '',
}) => {
  // Activate scroll-to-pay: pay every 4 unique photo reveals if enabled
  const { observeRef } = useGalleryScrollPayment(
    photos.map(p => p.id), 
    { enabled: enableAutoPayment, amount: paymentAmount ?? 1, perX: 4 }
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {photos.map((photo) => (
        <TravelPhotoCard
          key={photo.id}
          photo={photo}
          observeRef={observeRef(photo.id)}
        />
      ))}
    </div>
  );
};

interface TravelPhotoCardProps {
  photo: import('./TravelGallery').TravelPhoto;
  observeRef?: (el: HTMLElement | null) => void;
}

const TravelPhotoCard: React.FC<TravelPhotoCardProps> = ({
  photo,
  observeRef,
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg" ref={observeRef}>
      <div className="relative">
        <img
          src={photo.src}
          alt={photo.title}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h3 className="font-bold">{photo.title}</h3>
          <p className="text-sm opacity-90">{photo.location}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{photo.description}</p>
      </CardContent>
    </Card>
  );
};
