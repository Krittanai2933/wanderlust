
import { useState, useEffect, useRef } from 'react';
import { useWebLN } from './useWebLN';

interface UseScrollPaymentOptions {
  enabled: boolean;
  amount: number;
  cooldownPeriod: number; // in milliseconds
  threshold: number; // percentage of element visibility needed to trigger
}

export const useScrollPayment = (
  targetRef: React.RefObject<HTMLElement>,
  options: UseScrollPaymentOptions
) => {
  const { enabled, amount, cooldownPeriod = 1000, threshold = 75 } = options;
  const [hasPaid, setHasPaid] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { sendTip } = useWebLN();
  const lastPaymentTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isNowVisible = entry.isIntersecting && entry.intersectionRatio >= threshold / 100;

        // Only trigger when element becomes visible
        if (isNowVisible && !isVisible) {
          setIsVisible(true);

          // Check if we should make a payment
          const now = Date.now();
          if (!hasPaid && (now - lastPaymentTime.current > cooldownPeriod)) {
            // Always send payment to righttech@getalby.com (handled by sendTip)
            sendTip(amount)
              .then(() => {
                setHasPaid(true);
                lastPaymentTime.current = now;
              })
              .catch(console.error);
          }
        } else if (!isNowVisible && isVisible) {
          setIsVisible(false);
        }
      },
      {
        threshold: threshold / 100,
        rootMargin: "0px",
      }
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [enabled, amount, cooldownPeriod, threshold, hasPaid, isVisible, sendTip, targetRef]);

  // Function to reset the payment state
  const resetPayment = () => {
    setHasPaid(false);
  };

  return {
    hasPaid,
    isVisible,
    resetPayment,
  };
};
