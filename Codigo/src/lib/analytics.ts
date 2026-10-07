type AnalyticsValue = string | number | boolean;

export function trackEvent(name: string, properties: Record<string, AnalyticsValue> = {}) {
  if (typeof window === "undefined") return;

  const dataLayer = (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer;
  if (Array.isArray(dataLayer)) {
    dataLayer.push({ event: name, ...properties });
  }

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", name, properties);
  }
}
