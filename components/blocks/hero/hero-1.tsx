// components/blocks/hero/hero-1.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { stegaClean } from "next-sanity";
import PortableTextRenderer from "@/components/portable-text-renderer";
import { FadeIn } from "@/components/ui/fade.in";
import { PAGE_QUERYResult } from "@/sanity.types";

type Hero1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-1" }
>;

export default function Hero1({
  tagLine,
  title,
  body,
  image,
  links,
}: Hero1Props) {
  return (
    <div className="container dark:bg-background py-20 lg:pt-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center">
          {tagLine && (
            <FadeIn as="h1" delay={120} className="leading-[0] font-sans">
              <span className="text-base font-semibold">{tagLine}</span>
            </FadeIn>
          )}
          {title && (
            <FadeIn
              as="h2"
              delay={220}
              className="mt-6 text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl"
            >
              {title}
            </FadeIn>
          )}
          {body && (
            <FadeIn as="div" delay={320} className="mt-6 text-lg">
              <PortableTextRenderer value={body} />
            </FadeIn>
          )}
          {links && links.length > 0 && (
            <FadeIn
              delay={420}
              className="mt-10 flex flex-wrap gap-4"
              as="div"
            >
              {links.map((link) => (
                <Button
                  key={link.title}
                  variant={stegaClean(link?.buttonVariant)}
                  asChild
                >
                  <Link
                    href={link.href || "#"}
                    target={link.target ? "_blank" : undefined}
                    rel={link.target ? "noopener" : undefined}
                  >
                    {link.title}
                  </Link>
                </Button>
              ))}
            </FadeIn>
          )}
        </div>
        <div className="flex flex-col justify-center">
          {image && image.asset?._id && (
            <FadeIn delay={520}>
              <Image
                className="rounded-xl"
                src={urlFor(image).url()}
                alt={image.alt || ""}
                width={image.asset?.metadata?.dimensions?.width || 800}
                height={image.asset?.metadata?.dimensions?.height || 800}
                placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
                blurDataURL={image?.asset?.metadata?.lqip || ""}
                quality={100}
              />
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
