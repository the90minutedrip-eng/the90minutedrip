import heroImage from "@/assets/hero-jersey.jpg";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center py-16 md:py-24">
        <div className="space-y-6 animate-fade-in">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Quality Football Jerseys</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            The 90 Minute Drip
          </h1>
          <p className="text-muted-foreground text-lg max-w-prose">
            Premium quality jerseys at unbeatable prices. New Season, Legends, Retro & Special Editions. 
            <span className="font-semibold text-primary"> Pan India Shipping Available!</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg">Shop Now</Button>
            <Button variant="outline" size="lg">View All Jerseys</Button>
          </div>
        </div>
        <div className="relative">
          <img
            src={heroImage}
            alt="Quality football jersey at great value"
            className="w-full h-auto rounded-xl border shadow-elevated hover-scale"
            loading="eager"
          />
          <div className="pointer-events-none absolute -inset-10 -z-10 blur-3xl opacity-50" aria-hidden style={{ backgroundImage: 'var(--gradient-primary)' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
