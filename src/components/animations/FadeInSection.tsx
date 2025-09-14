import { useEffect, useRef, useState } from 'react';

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number; // Delay in ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number; // Value between 0 and 1
  className?: string;
}

const FadeInSection = ({
  children,
  delay = 0,
  direction = 'up',
  threshold = 0.1,
  className = '',
}: FadeInSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // When the element enters the viewport
        if (entries[0].isIntersecting) {
          // Add a delay if specified
          if (delay) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          // Once it's visible, we don't need to observe anymore
          if (domRef.current) observer.unobserve(domRef.current);
        }
      },
      { threshold }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, [delay, threshold]);

  // Define transform based on direction
  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'translateY(30px)';
        case 'down':
          return 'translateY(-30px)';
        case 'left':
          return 'translateX(30px)';
        case 'right':
          return 'translateX(-30px)';
        case 'none':
          return 'none';
        default:
          return 'translateY(30px)';
      }
    }
    return 'none';
  };

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: isVisible ? 'none' : 'blur(5px)',
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
};

export default FadeInSection;