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
>;

const ALIGN_CLASS_MAP: Record<"left" | "center" | "right", string> = {
  left: "ml-0 mr-auto",
  center: "mx-auto",
  right: "ml-auto mr-0",
};

const SIZE_CLASS_MAP: Record<"small" | "medium" | "large" | "full", string> = {
  small: "max-w-[12rem] sm:max-w-[16rem]",
  medium: "max-w-[18rem] sm:max-w-[22rem]",
  large: "max-w-[24rem] sm:max-w-[30rem]",
  full: "w-full max-w-none",
};

const HEIGHT_CLASS_MAP: Record<"small" | "medium" | "large" | "full", string> = {
  small: "h-20 sm:h-24",
  medium: "h-24 sm:h-28 md:h-32",
  large: "h-28 sm:h-32 md:h-40",
  full: "h-28 sm:h-36 md:h-44",
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
              className="h-full w-full"
              ariaLabel={label}
              style={FILLED_SIZE_STYLE}
              preserveAspectRatio="xMidYMid slice"
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
