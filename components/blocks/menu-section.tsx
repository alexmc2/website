// components/blocks/menu-section.tsx
import Image from "next/image";
import { stegaClean } from "next-sanity";
import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";
import { urlFor } from "@/sanity/lib/image";
import type { PAGE_QUERYResult, ColorVariant } from "@/sanity.types";
import type { CSSProperties } from "react";
import MenuLottie from "@/components/blocks/menu/menu-lottie";

type MenuSectionProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "menu-section" }
>;

const TEXTURE_STYLE_MAP: Record<string, CSSProperties> = {
  paper: {
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(30, 41, 59, 0.08) 1px, transparent 0)",
    backgroundSize: "28px 28px",
    opacity: 0.55,
  },
  canvas: {
    backgroundImage:
      "linear-gradient(90deg, rgba(15, 23, 42, 0.06) 1px, transparent 1px), linear-gradient(180deg, rgba(15, 23, 42, 0.06) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    opacity: 0.45,
  },
};

const HEADING_FONT_CLASS: Record<string, string> = {
  serif: "font-serif text-balance",
  sans: "font-sans text-balance",
};

const DISPLAY_MODE_DEFAULT = "structured" satisfies MenuSectionProps["displayMode"];

function toColorVariant(value?: string | null): ColorVariant | undefined {
  return value ? (value as ColorVariant) : undefined;
}

function MenuImage({
  image,
  className,
}: {
  image: NonNullable<MenuSectionProps["menuImage"]>;
  className?: string;
}) {
  if (!image?.asset?._id) {
    return null;
  }

  const width = image.asset.metadata?.dimensions?.width ?? 1280;
  const height = image.asset.metadata?.dimensions?.height ?? 1920;

  return (
    <figure className={cn("overflow-hidden rounded-3xl border border-white/20 bg-white/40 shadow-lg backdrop-blur", className)}>
      <Image
        src={urlFor(image).width(1400).height(Math.round((height / width) * 1400)).quality(85).url()}
        alt={image.alt || "Menu selection"}
        width={width}
        height={height}
        className="h-auto w-full object-cover"
        placeholder={image.asset.metadata?.lqip ? "blur" : undefined}
        blurDataURL={image.asset.metadata?.lqip || undefined}
        sizes="(min-width: 1024px) 480px, 100vw"
        loading="lazy"
      />
    </figure>
  );
}

function ItemImage({
  image,
}: {
  image: NonNullable<MenuSectionProps["categories"]>[number]["items"][number]["itemImage"];
}) {
  if (!image?.asset?._id) {
    return null;
  }

  const width = image.asset.metadata?.dimensions?.width ?? 240;
  const height = image.asset.metadata?.dimensions?.height ?? 240;

  return (
    <Image
      src={urlFor(image).width(320).height(Math.round((height / width) * 320)).quality(80).url()}
      alt={image.alt || ""}
      width={width}
      height={height}
      className="h-20 w-20 flex-none rounded-2xl object-cover shadow-sm"
      placeholder={image.asset.metadata?.lqip ? "blur" : undefined}
      blurDataURL={image.asset.metadata?.lqip || undefined}
      loading="lazy"
    />
  );
}

export default function MenuSection({
  padding,
  background,
  eyebrow,
  title,
  intro,
  headingFont,
  displayMode,
  menuImage,
  categories,
  lottieAnimation,
  lottiePlacement,
}: MenuSectionProps) {
  const sanitizedStyle = stegaClean(background?.style) as
    | "color"
    | "texture"
    | "image"
    | null;
  const colorVariant = toColorVariant(
    sanitizedStyle === "color"
      ? stegaClean(background?.colorVariant)
      : sanitizedStyle === "texture"
      ? stegaClean(background?.textureTint)
      : undefined
  );

  const texturePreset = stegaClean(background?.texturePreset);
  const textureStyle =
    sanitizedStyle === "texture" && texturePreset
      ? TEXTURE_STYLE_MAP[texturePreset as keyof typeof TEXTURE_STYLE_MAP]
      : undefined;

  const customBackgroundImage =
    sanitizedStyle === "image" ? background?.customImage : undefined;
  const backgroundOpacity =
    customBackgroundImage?.opacity && customBackgroundImage.opacity > 0
      ? customBackgroundImage.opacity
      : 0.35;

  const sanitizedDisplayMode = (stegaClean(displayMode) || DISPLAY_MODE_DEFAULT) as
    | "structured"
    | "image"
    | "combined";
  const showStructured = sanitizedDisplayMode === "structured" || sanitizedDisplayMode === "combined";
  const showImage = sanitizedDisplayMode === "image" || sanitizedDisplayMode === "combined";

  const sanitizedHeadingFont = (stegaClean(headingFont) || "sans") as keyof typeof HEADING_FONT_CLASS;
  const headingFontClass = HEADING_FONT_CLASS[sanitizedHeadingFont] || HEADING_FONT_CLASS.sans;

  const filteredCategories = (categories || []).filter((category) => {
    const hasItems = (category?.items || []).some((item) => item?.name);
    return Boolean(category?.title) || hasItems;
  });

  const lottieUrl = lottieAnimation?.asset?.url;
  const lottiePosition = (stegaClean(lottiePlacement) || "heading") as "heading" | "aside";

  return (
    <SectionContainer
      color={colorVariant}
      padding={padding}
      className={cn(
        "overflow-hidden",
        sanitizedStyle !== "color" && "bg-background"
      )}
    >
      <div className="relative">
        {textureStyle ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-80 mix-blend-multiply"
            style={textureStyle}
          />
        ) : null}
        {customBackgroundImage?.asset?._id ? (
          <div className="pointer-events-none absolute inset-0 -z-10">
            <Image
              src={urlFor(customBackgroundImage)
                .width(2400)
                .height(
                  Math.round(
                    ((customBackgroundImage.asset.metadata?.dimensions?.height || 1600) /
                      (customBackgroundImage.asset.metadata?.dimensions?.width || 1600)) *
                      2400
                  )
                )
                .quality(60)
                .url()}
              alt={customBackgroundImage.alt || "Decorative menu background"}
              fill
              className="object-cover"
              priority={false}
            />
            <div
              className="absolute inset-0 bg-background"
              style={{ opacity: backgroundOpacity, mixBlendMode: "multiply" }}
            />
          </div>
        ) : null}

        <div className="relative z-10 grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_1fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            <div className="flex flex-col gap-6">
              <h2 className={cn("text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight", headingFontClass)}>
                {title}
              </h2>
              {intro ? (
                <p className="max-w-xl text-lg text-muted-foreground">{intro}</p>
              ) : null}
            </div>
            {lottieUrl && lottiePosition === "heading" ? (
              <div className="mt-4 w-40 sm:w-48">
                <MenuLottie src={lottieUrl} ariaLabel="Menu accent animation" />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-12">
            {showImage && menuImage?.asset?._id ? (
              <MenuImage image={menuImage} />
            ) : null}

            {lottieUrl && lottiePosition === "aside" ? (
              <div className="-mb-4 self-end w-36 lg:w-48">
                <MenuLottie src={lottieUrl} ariaLabel="Decorative animation" />
              </div>
            ) : null}

            {showStructured && filteredCategories.length > 0 ? (
              <div className="space-y-12">
                {filteredCategories.map((category, index) => (
                  <section
                    key={category?._key || `${category?.title}-${index}`}
                    className={cn(
                      "border-t border-border/30 pt-10",
                      index === 0 && "border-t-0 pt-0"
                    )}
                  >
                    <div className="flex flex-col gap-3">
                      {category?.title ? (
                        <h3 className="text-xl font-semibold tracking-tight text-foreground">
                          {category.title}
                        </h3>
                      ) : null}
                      {category?.description ? (
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-6 divide-y divide-border/20">
                      {(category?.items || []).map((item) => {
                        if (!item?.name) {
                          return null;
                        }
                        return (
                          <article key={item._key || item.name} className="py-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex gap-4">
                                {item.itemImage ? <ItemImage image={item.itemImage} /> : null}
                                <div className="space-y-2">
                                  <div className="flex items-baseline justify-between gap-4">
                                    <h4 className="text-lg font-medium text-foreground">
                                      {item.name}
                                    </h4>
                                    <span className="text-base font-semibold tracking-wide text-foreground sm:text-right">
                                      {item.price}
                                    </span>
                                  </div>
                                  {item.description ? (
                                    <p className="text-sm text-muted-foreground">
                                      {item.description}
                                    </p>
                                  ) : null}
                                  {item.dietary ? (
                                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                      {item.dietary}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
