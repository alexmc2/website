// components/blocks/lottie-animation.tsx
import { stegaClean } from "next-sanity";
import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import MenuLottie from "@/components/blocks/menu/menu-lottie";

import type { ColorVariant, PAGE_QUERYResult } from "@/sanity.types";
import type { CSSProperties } from "react";

type LottieAnimationProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "lottie-animation" }
> & {
  animationDark?: {
    asset?: {
      url?: string | null;
    } | null;
  } | null;
};

const ALIGN_CLASS_MAP: Record<"left" | "center" | "right", string> = {
  left: "ml-0 mr-auto",
  center: "mx-auto",
  right: "ml-auto mr-0",
};

const SIZE_CLASS_MAP: Record<"small" | "medium" | "large" | "full", string> = {
  small: "max-w-[14rem] sm:max-w-[18rem]",
  medium: "max-w-[20rem] sm:max-w-[28rem] md:max-w-[32rem]",
  large: "max-w-[32rem] sm:max-w-[40rem] md:max-w-[48rem]",
  full: "w-full max-w-none",
};

const HEIGHT_CLASS_MAP: Record<"small" | "medium" | "large" | "full", string> = {
  small: "h-24 sm:h-28",
  medium: "h-32 sm:h-40 md:h-48",
  large: "h-40 sm:h-52 md:h-64",
  full: "h-48 sm:h-60 md:h-72 lg:h-80",
};

const FILLED_SIZE_STYLE = {
  width: "100%",
  height: "100%",
} satisfies CSSProperties;

const TOP_SPACING_CLASS_MAP: Record<
  "none" | "tight" | "compact" | "comfortable" | "roomy",
  string
> = {
  none: "pt-0",
  tight: "pt-3 md:pt-4",
  compact: "pt-6 md:pt-8",
  comfortable: "pt-10 md:pt-12",
  roomy: "pt-14 md:pt-16",
};

const BOTTOM_SPACING_CLASS_MAP: Record<
  "none" | "tight" | "compact" | "comfortable" | "roomy",
  string
> = {
  none: "pb-0",
  tight: "pb-3 md:pb-4",
  compact: "pb-6 md:pb-8",
  comfortable: "pb-10 md:pb-12",
  roomy: "pb-14 md:pb-16",
};

export default function LottieAnimationBlock({
  padding,
  colorVariant,
  sectionWidth,
  animationAlign,
  animationSize,
  verticalSpacing,
  animation,
  animationDark,
  ariaLabel,
}: LottieAnimationProps) {
  const resolvedColor = (stegaClean(colorVariant) || undefined) as
    | ColorVariant
    | undefined;
  const width = stegaClean(sectionWidth);
  const align = (stegaClean(animationAlign) || "center") as
    | "left"
    | "center"
    | "right";
  const size = (stegaClean(animationSize) || "medium") as
    | "small"
    | "medium"
    | "large"
    | "full";
  const spacing = (stegaClean(verticalSpacing) || "compact") as
    | "none"
    | "tight"
    | "compact"
    | "comfortable"
    | "roomy";
  const hasTopPadding = Boolean(padding?.top);
  const hasBottomPadding = Boolean(padding?.bottom);
  const src = animation?.asset?.url || undefined;
  const srcDark = animationDark?.asset?.url || undefined;
  const label = (stegaClean(ariaLabel) || undefined) as string | undefined;

  if (!src) {
    return null;
  }

  return (
    <SectionContainer
      color={resolvedColor}
      padding={padding}
      className={cn(
        !hasTopPadding ? TOP_SPACING_CLASS_MAP[spacing] : undefined,
        !hasBottomPadding ? BOTTOM_SPACING_CLASS_MAP[spacing] : undefined
      )}
    >
      <div className={cn("w-full", width === "narrow" ? "max-w-4xl mx-auto" : undefined)}>
        <div
          className={cn(
            "w-full",
            ALIGN_CLASS_MAP[align],
            SIZE_CLASS_MAP[size],
            size !== "full" ? "w-full" : undefined
          )}
        >
          <div
            className={cn(
              "relative flex w-full items-center justify-center overflow-hidden",
              HEIGHT_CLASS_MAP[size]
            )}
          >
            <MenuLottie
              src={src}
              srcDark={srcDark}
              className="h-full w-full"
              ariaLabel={label}
              style={FILLED_SIZE_STYLE}
              preserveAspectRatio="xMidYMid meet"
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
