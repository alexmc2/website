'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';

type HeroCarouselImage = {
  _key?: string;
  alt?: string | null;
  asset?: {
    _id?: string | null;
    metadata?: {
      lqip?: string | null;
    } | null;
  } | null;
} & Record<string, unknown>;

type HeroFullCarouselProps = {
  images: HeroCarouselImage[];
  autoAdvanceInterval?: number;
};

const DEFAULT_INTERVAL_MS = 12000;

export function HeroFullCarousel({
  images,
  autoAdvanceInterval = DEFAULT_INTERVAL_MS,
}: HeroFullCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shouldAutoAdvance, setShouldAutoAdvance] = useState(true);
  const resumeTimeoutRef = useRef<number | null>(null);

  const carouselOptions = useMemo(
    () => ({
      loop: images.length > 1,
      align: 'start' as const,
      duration: 40,
    }),
    [images.length]
  );

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const handleSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    handleSelect();
    carouselApi.on('select', handleSelect);
    carouselApi.on('reInit', handleSelect);

    return () => {
      carouselApi.off('select', handleSelect);
      carouselApi.off('reInit', handleSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setShouldAutoAdvance(!mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    if (!carouselApi || images.length <= 1 || !shouldAutoAdvance) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (!carouselApi) {
        return;
      }

      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, autoAdvanceInterval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoAdvanceInterval, carouselApi, images.length, shouldAutoAdvance]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  if (images.length === 0) {
    return null;
  }

  const pauseAutoAdvance = () => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    setShouldAutoAdvance(false);
    resumeTimeoutRef.current = window.setTimeout(() => {
      setShouldAutoAdvance(true);
    }, autoAdvanceInterval);
  };

  const handlePrev = () => {
    if (!carouselApi) return;
    pauseAutoAdvance();
    carouselApi.scrollPrev();
  };

  const handleNext = () => {
    if (!carouselApi) return;
    pauseAutoAdvance();
    if (carouselApi.canScrollNext()) {
      carouselApi.scrollNext();
    } else {
      carouselApi.scrollTo(0);
    }
  };

  return (
    <Carousel className="relative size-full" opts={carouselOptions} setApi={setCarouselApi}>
      <CarouselContent className="h-full !-ml-0">
        {images.map((carouselImage, index) => {
          const key =
            carouselImage?._key ||
            carouselImage?.asset?._id ||
            `hero-carousel-image-${index}`;
          const isActive = index === activeIndex;

          return (
            <CarouselItem className="h-full !pl-0" key={key}>
              <div
                className={cn(
                  'relative h-full w-full overflow-hidden will-change-transform motion-reduce:animate-none',
                  isActive ? 'animate-zoom-in' : 'animate-none'
                )}
              >
                <Image
                  src={urlFor(carouselImage).url()}
                  alt={carouselImage?.alt || ''}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                  placeholder={
                    carouselImage?.asset?.metadata?.lqip ? 'blur' : undefined
                  }
                  blurDataURL={
                    carouselImage?.asset?.metadata?.lqip || undefined
                  }
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious
            type="button"
            variant="outline"
            size="icon"
            disabled={false}
            onClick={(event) => {
              event.preventDefault();
              handlePrev();
            }}
            className="left-6 top-1/2 -translate-y-1/2 border-slate-600 bg-transparent text-slate-300 hover:bg-slate-700 z-30 cursor-pointer"
          />
          <CarouselNext
            type="button"
            variant="outline"
            size="icon"
            disabled={false}
            onClick={(event) => {
              event.preventDefault();
              handleNext();
            }}
            className="right-6 top-1/2 -translate-y-1/2 border-white/40 bg-black/30 text-white hover:bg-black/50 z-30 cursor-pointer"
          />
        </>
      )}
    </Carousel>
  );
}
