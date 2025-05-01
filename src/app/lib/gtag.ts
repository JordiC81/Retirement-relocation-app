// src/app/lib/gtag.ts

// Your Google Analytics tracking ID
export const GA_TRACKING_ID = 'G-GD13L63NED';

// Define the window with gtag property for TypeScript
interface WindowWithGTag extends Window {
  gtag: (
    command: string,
    targetId: string,
    config?: {
      page_path?: string;
      event_category?: string;
      event_label?: string;
      value?: number;
      [key: string]: unknown;
    }
  ) => void;
}

// Type for event parameters
export interface GTagEvent {
  action: string;
  category: string;
  label: string;
  value?: number;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  // Type guard to check if gtag is available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const typedWindow = window as WindowWithGTag;
    typedWindow.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent): void => {
  // Type guard to check if gtag is available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const typedWindow = window as WindowWithGTag;
    typedWindow.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};