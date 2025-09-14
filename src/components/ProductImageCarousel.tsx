import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type MediaItem = {
  type: 'image' | 'video';
  url: string;
};

interface ProductImageCarouselProps {
  images: string[];
  videos?: string[];
  productName: string;
  className?: string;
  aspectRatio?: string;
  thumbnailSize?: number;
}

export default function ProductImageCarousel({
  images,
  videos = [],
  productName,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  thumbnailSize = 60
}: ProductImageCarouselProps) {
  // Convert images and videos to a unified media array
  const media: MediaItem[] = [
    ...images.map(url => ({ type: 'image' as const, url })),
    ...videos.map(url => ({ type: 'video' as const, url }))
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex(current => (current === 0 ? media.length - 1 : current - 1));
  };

  const goToNext = () => {
    setCurrentIndex(current => (current === media.length - 1 ? 0 : current + 1));
  };

  if (media.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`${aspectRatio} overflow-hidden rounded-lg bg-muted`}>
        {media[currentIndex].type === 'image' ? (
          <img
            src={media[currentIndex].url}
            alt={`${productName} product image ${currentIndex + 1}`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <video
            src={media[currentIndex].url}
            controls
            className="w-full h-full object-contain"
            aria-label={`${productName} product video ${currentIndex + 1}`}
          />
        )}
      </div>

      {media.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex justify-center mt-2 gap-2 overflow-x-auto py-1">
            {media.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative rounded border ${currentIndex === index ? 'border-primary' : 'border-muted'} overflow-hidden transition-all`}
                style={{ width: `${thumbnailSize}px`, height: `${thumbnailSize}px` }}
                aria-label={`View ${item.type} ${index + 1}`}
                aria-current={currentIndex === index ? 'true' : 'false'}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}