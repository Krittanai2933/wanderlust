
import { useRef, useEffect } from 'react';
import { useWebLN } from './useWebLN';

/**
 * Triggers payment every N unique photo views (e.g., every 4 reveals)
 * @param photoIds List of gallery photo unique IDs.
 * @param options enabled: if scroll-pay is active, amount: satoshis per payment, perX: trigger every X photos.
 * @returns {observeRef} - a ref-callback to attach to all photo elements (call with photoId)
 */
interface UseGalleryScrollPaymentOptions {
  enabled: boolean;
  amount: number;
  perX?: number; // pay every N photos
}

type ObserveRef = (photoId: string) => (el: HTMLElement | null) => void;

export function useGalleryScrollPayment(
  photoIds: string[],
  options: UseGalleryScrollPaymentOptions
): { observeRef: ObserveRef, viewsCount: number } {
  const { enabled, amount, perX = 1 } = options;
  const photoElements = useRef<{ [photoId: string]: HTMLElement | null }>({});
  const revealed = useRef<Set<string>>(new Set());
  const viewsSinceLastPayment = useRef<number>(0);
  const { sendTip } = useWebLN();

  // Helper ref callback for each photo
  const observeRef: ObserveRef = photoId => node => {
    photoElements.current[photoId] = node;
  };

  useEffect(() => {
    if (!enabled) return;

    const observer = new window.IntersectionObserver((entries) => {
      for (const entry of entries) {
        const photoId = Object.entries(photoElements.current)
          .find(([, el]) => el === entry.target)?.[0];
        if (!photoId) continue;

        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // If not yet counted, "reveal" this photo
          if (!revealed.current.has(photoId)) {
            revealed.current.add(photoId);
            viewsSinceLastPayment.current += 1;

            if (viewsSinceLastPayment.current >= perX) {
              // Only pay once for a group of N
              sendTip(amount).catch(console.error);
              viewsSinceLastPayment.current = 0;
            }
          }
        }
      }
    }, {
      threshold: 0.5,
    });

    // Observe all current photo elements
    Object.values(photoElements.current).forEach(el => {
      if (el) observer.observe(el);
    });

    // Cleanup
    return () => {
      observer.disconnect();
      revealed.current.clear();
      viewsSinceLastPayment.current = 0;
    };
  }, [photoIds, enabled, amount, perX, sendTip]);

  return { observeRef, viewsCount: revealed.current.size };
}
