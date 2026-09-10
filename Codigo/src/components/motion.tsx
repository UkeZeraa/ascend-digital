import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useTilt } from "@/hooks/useTilt";

/** Wrapper que puxa o conteúdo na direção do cursor. */
export function Magnetic({
  children,
  className,
  strength,
  max,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  max?: number;
}) {
  const ref = useMagnetic<HTMLSpanElement>(strength, max);
  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {children}
    </span>
  );
}

/** Card que inclina em 3D seguindo o cursor. */
export function TiltCard({
  children,
  className,
  maxDeg,
}: {
  children: ReactNode;
  className?: string;
  maxDeg?: number;
}) {
  const ref = useTilt<HTMLDivElement>(maxDeg);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
