import { useEffect, useRef, useState, useCallback } from "react";

interface Founder {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

const FOUNDERS: Founder[] = [
  {
    id: "pixel-maestro",
    title: "Pixel Maestro",
    subtitle: "The digital wizard",
    description: "Codes dreams into reality — shaping immersive drops, micro-interactions, and seamless checkouts.",
  },
  {
    id: "captain-turf",
    title: "Captain Turf",
    subtitle: "Field general",
    description: "Fabric scout and negotiation ace — sources premium kits, locks deals, and keeps quality match-ready.",
  },
  {
    id: "storysmith",
    title: "Storysmith",
    subtitle: "Narrative alchemist",
    description: "Spins words and visuals into addictive scroll-stoppers — every launch a cliffhanger you have to share.",
  },
  {
    id: "phantom-benefactor",
    title: "The Phantom Benefactor",
    subtitle: "Shadow backer",
    description: "Deep pockets, deeper mysteries — fuels limited runs and midnight drops that disappear in seconds.",
  },
  {
    id: "data-whisperer",
    title: "Data Whisperer",
    subtitle: "Trend oracle",
    description: "Spots textures and trends before they hit the pitch — inventory tuned to the beat of the market.",
  },
];

// Enhanced scroll-based animation hook with position-based blur
const useScrollAnimation = () => {
  const [founderStates, setFounderStates] = useState<Array<{
    distanceFromCenter: number;
    blurAmount: number;
    opacity: number;
    scale: number;
  }>>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const founderRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updateFounderStates = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const viewportCenter = window.innerHeight / 2;
    const maxBlur = 12; // Maximum blur amount
    const blurRange = window.innerHeight * 0.8; // Increased distance range for blur calculation
    const centerDeadZone = window.innerHeight * 0.25; // Area around center that stays unblurred

    const newStates = founderRefs.current.map((ref, index) => {
      if (!ref) return { distanceFromCenter: Infinity, blurAmount: maxBlur, opacity: 0.3, scale: 0.9 };

      const rect = ref.getBoundingClientRect();
      const founderCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(founderCenter - viewportCenter);
      
      // Create a dead zone around the center where blur is 0
      const effectiveDistance = Math.max(0, distanceFromCenter - centerDeadZone);
      const effectiveRange = blurRange - centerDeadZone;
      
      // Calculate blur based on effective distance from viewport center
      const normalizedDistance = Math.min(effectiveDistance / effectiveRange, 1);
      const blurAmount = normalizedDistance * maxBlur;
      
      // Calculate opacity based on effective distance (closer = more opaque)
      const opacity = Math.max(0.3, 1 - (normalizedDistance * 0.7));
      
      // Calculate scale based on effective distance (closer = larger)
      const scale = Math.max(0.9, 1 - (normalizedDistance * 0.1));

      return {
        distanceFromCenter,
        blurAmount,
        opacity,
        scale
      };
    });

    setFounderStates(newStates);

    // Calculate overall scroll progress
    const scrollTop = window.pageYOffset;
    const containerTop = container.offsetTop;
    const containerHeight = container.offsetHeight;
    const progress = Math.max(0, Math.min(1, (scrollTop - containerTop + window.innerHeight) / (containerHeight + window.innerHeight)));
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(updateFounderStates);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateFounderStates(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateFounderStates]);

  return { founderStates, scrollProgress, containerRef, founderRefs };
};

const FounderCard = ({
  founder,
  index,
  founderState,
  scrollProgress
}: {
  founder: Founder;
  index: number;
  founderState: {
    distanceFromCenter: number;
    blurAmount: number;
    opacity: number;
    scale: number;
  };
  scrollProgress: number;
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Use scroll-position-based values
  const { blurAmount, opacity, scale } = founderState;
  const isActive = blurAmount < 2; // Consider active when blur is minimal
  
  // Calculate transforms based on scroll position
  const translateY = (1 - scale) * 30; // More distance = more translateY
  const rotateX = (1 - scale) * 8; // More distance = more rotation
  const rotateY = (1 - scale) * -8;
  const translateZ = (1 - scale) * -100; // More distance = further back

  // Dynamic 3D transforms based on scroll position
  const transform = `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;

  return (
    <article
      ref={cardRef}
      id={founder.id}
      aria-label={`${founder.title} — ${founder.subtitle}`}
      className="min-h-[100vh] snap-start grid md:grid-cols-12 items-center gap-8 py-12 md:py-20 relative"
      style={{
        filter: `blur(${blurAmount}px)`,
        opacity,
        transition: 'filter 100ms ease-out, opacity 150ms ease-out',
      }}
    >
      {/* Background overlay for enhanced blur effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isActive ? 'transparent' : `rgba(0, 0, 0, ${0.15 * (1 - opacity)})`,
          transition: 'background 150ms ease-out',
        }}
      />

      <div className="md:col-span-5 relative z-10">
        <p
          className="text-sm uppercase tracking-widest text-muted-foreground"
          style={{
            transform: `translateX(${(1 - scale) * -30}px)`,
            transition: 'transform 200ms ease-out',
          }}
        >
          Founder {String(index + 1).padStart(2, "0")}
        </p>
        <h3
          className="text-2xl md:text-4xl font-semibold mt-2"
          style={{
            transform: `translateX(${(1 - scale) * -40}px)`,
            transition: 'transform 250ms ease-out',
          }}
        >
          {founder.title}
        </h3>
        <p
          className="text-muted-foreground mt-2"
          style={{
            transform: `translateX(${(1 - scale) * -25}px)`,
            transition: 'transform 300ms ease-out',
          }}
        >
          {founder.subtitle}
        </p>
      </div>

      <div className="md:col-span-7 relative z-10">
        <div
          className="relative rounded-xl border bg-card/80 backdrop-blur-sm shadow-lg overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            transform,
            transition: "transform 200ms ease-out, box-shadow 250ms ease-out",
            boxShadow: isActive
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="p-6 md:p-10">
            <p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              style={{
                transform: `translateY(${(1 - scale) * 15}px)`,
                transition: 'transform 350ms ease-out',
              }}
            >
              {founder.description}
            </p>
          </div>

          {/* Enhanced glow effect */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-12 -z-10 blur-3xl"
            style={{
              backgroundImage: "var(--gradient-primary)",
              opacity: isActive ? 0.6 : 0.2,
              transition: 'opacity 300ms ease-out',
            }}
          />
        </div>
      </div>
    </article>
  );
};

const Founders = () => {
  const { founderStates, scrollProgress, containerRef, founderRefs } = useScrollAnimation();
  
  // Find the most active founder (least blurred) for progress indicator
  const activeFounder = founderStates.length > 0
    ? founderStates.reduce((minIndex, state, index) =>
        state.blurAmount < founderStates[minIndex]?.blurAmount ? index : minIndex, 0)
    : null;

  return (
    <section
      id="about"
      aria-label="Founding story"
      className="relative"
      style={{
        background: `linear-gradient(180deg,
          rgba(0, 0, 0, ${0.02 + scrollProgress * 0.08}) 0%,
          rgba(0, 0, 0, ${0.05 + scrollProgress * 0.1}) 100%)`,
        transition: 'background 300ms ease',
        scrollBehavior: 'smooth',
      }}
    >
      {/* Fixed background blur overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backdropFilter: activeFounder !== null ? 'blur(1px)' : 'blur(0px)',
          background: activeFounder !== null ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          transition: 'backdrop-filter 200ms ease-out, background 250ms ease-out',
        }}
      />

      <div className="container mx-auto py-20 md:py-28 relative z-10">
        <header className="mb-10 md:mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold">Our Founding Story: The Five Partners</h2>
          <p className="text-muted-foreground mt-3 md:mt-4">
            Meet the crew behind The 90 Minute Drip — five minds, one obsession: elite kits with a legend's aura.
          </p>
        </header>

        <div
          ref={containerRef}
          className="[perspective:1200px] space-y-0"
          style={{
            scrollSnapType: 'y mandatory',
            scrollBehavior: 'smooth',
          }}
        >
          {FOUNDERS.map((founder, index) => (
            <div
              key={founder.id}
              ref={(el) => (founderRefs.current[index] = el)}
              style={{
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
              }}
            >
              <FounderCard
                founder={founder}
                index={index}
                founderState={founderStates[index] || { distanceFromCenter: Infinity, blurAmount: 12, opacity: 0.3, scale: 0.9 }}
                scrollProgress={scrollProgress}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced scroll progress indicator with smooth transitions */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20 hidden md:block">
        <div className="flex flex-col space-y-3">
          {FOUNDERS.map((_, index) => (
            <div
              key={index}
              className="relative w-3 h-12 rounded-full border border-white/30 overflow-hidden backdrop-blur-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                boxShadow: activeFounder === index
                  ? '0 0 20px rgba(255, 255, 255, 0.3)'
                  : '0 0 5px rgba(255, 255, 255, 0.1)',
                transition: 'all 600ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div
                className="w-full rounded-full transition-all duration-700 ease-out"
                style={{
                  height: activeFounder === index ? '100%' : '0%',
                  background: activeFounder === index
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 100%)'
                    : 'transparent',
                  transform: activeFounder === index ? 'scaleY(1)' : 'scaleY(0)',
                  transformOrigin: 'bottom',
                }}
              />
              {/* Pulse effect for active indicator */}
              {activeFounder === index && (
                <div
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Founders;
