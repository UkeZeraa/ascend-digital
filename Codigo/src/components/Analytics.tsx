import { useEffect } from "react";

const Analytics = () => {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
    if (!measurementId || document.querySelector(`script[data-ga4="${measurementId}"]`)) return;

    const dataLayer = ((window as Window & { dataLayer?: unknown[] }).dataLayer ??= []);
    const gtag = (...args: unknown[]) => dataLayer.push(args);
    (window as Window & { gtag?: typeof gtag }).gtag = gtag;
    gtag("js", new Date());
    gtag("config", measurementId, { anonymize_ip: true });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.ga4 = measurementId;
    document.head.appendChild(script);
  }, []);

  return null;
};

export default Analytics;
