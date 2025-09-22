// components/blocks/hero/hero-full.tsx
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import PortableTextRenderer from '@/components/portable-text-renderer';
import { FadeIn } from '@/components/ui/fade.in';
import { cn } from '@/lib/utils';

type HeroFullProps = {
  tagLine?: string | null;
  title?: string | null;
  body?: any;
  image?: any;
  height?: 'screen' | '70vh' | '60vh' | null;
  overlay?: boolean | null;
  overlayStrength?: number | null;
  contentAlignment?: 'left' | 'center' | 'right' | null;
};

export default function HeroFull({
  tagLine,
  title,
  body,
  image,
  height = 'screen',
  overlay = true,
  overlayStrength = 50,
  contentAlignment = 'center',
}: HeroFullProps) {
  const isFullScreen = !height || height === 'screen';
  const resolvedMinHeight = !isFullScreen ? height || '60vh' : undefined;
  const overlayOpacity = Math.max(0, Math.min(100, overlayStrength || 0)) / 100;
  const justify =
    contentAlignment === 'left'
      ? 'lg:justify-start'
      : contentAlignment === 'right'
        ? 'justify-end'
        : 'justify-center';
  const textAlign =
    contentAlignment === 'left'
      ? 'lg:text-left'
      : contentAlignment === 'right'
        ? 'text-center'
        : 'text-center';

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        isFullScreen && '-mt-14 min-h-[calc(100vh+3.5rem)]'
      )}
      style={!isFullScreen ? { minHeight: resolvedMinHeight } : undefined}
    >
      {(image?.asset?._id || overlay) && (
        <div className="absolute inset-0">
          {image?.asset?._id && (
            <div className="relative h-full w-full overflow-hidden animate-zoom-in">
              <Image
                src={urlFor(image).url()}
                alt={image.alt || ''}
                fill
                priority
                className="object-cover"
                sizes="100vw"
                placeholder={image?.asset?.metadata?.lqip ? 'blur' : undefined}
                blurDataURL={image?.asset?.metadata?.lqip || undefined}
              />
            </div>
          )}
          {overlay && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
            />
          )}
        </div>
      )}
      {(tagLine || title || body) && (
        <div
          className={`absolute inset-0 flex items-center ${justify} px-6 lg:px-32`}
        >
          <div className={`max-w-2xl text-white text-center   ${textAlign}`}>
            {tagLine && (
              <FadeIn
                as="p"
                delay={120}
                className="text-sm font-semibold tracking-wide opacity-90"
              >
                {tagLine}
              </FadeIn>
            )}
            {title && (
              <FadeIn
                as="h1"
                delay={200}
                className="mt-4 text-5xl md:text-7xl"
              >
                {title}
              </FadeIn>
            )}
            {body && (
              <FadeIn
                as="div"
                delay={260}
                className="mt-6 sm:text-3xl text-2xl opacity-95"
              >
                <PortableTextRenderer value={body} />
              </FadeIn>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
