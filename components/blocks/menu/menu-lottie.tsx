"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const LottiePlayer = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => null,
});

interface MenuLottieProps {
  src: string;
  className?: string;
  ariaLabel?: string;
  style?: CSSProperties;
}

type AnimationData = Record<string, unknown> | null;

export default function MenuLottie({ src, className, ariaLabel, style }: MenuLottieProps) {
  const [animationData, setAnimationData] = useState<AnimationData>(null);

  useEffect(() => {
    if (!src) {
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchAnimation = async () => {
      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as AnimationData;
        if (isMounted) {
          setAnimationData(data);
        }
      } catch (error) {
        if (isMounted) {
          setAnimationData(null);
        }
      }
    };

    fetchAnimation();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [src]);

  if (!animationData) {
    return null;
  }

  return (
    <LottiePlayer
      animationData={animationData}
      loop
      autoplay
      className={cn("pointer-events-none", className)}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      style={style}
    />
  );
}
