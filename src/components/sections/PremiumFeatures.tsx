import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Crown, Award, Gem, CheckCircle, Star } from "lucide-react";

interface Feature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  gradient: string;
}

const features: Feature[] = [
  {
    id: "quality",
    title: "Quality Materials",
    subtitle: "Durable & Comfortable",
    description: "Our jerseys are made with high-quality fabrics that ensure comfort, breathability, and long-lasting wear.",
    icon: <Shield className="w-8 h-8" />,
    benefits: [
      "Premium fabric quality",
      "Breathable materials",
      "Durable construction",
      "Comfortable fit"
    ],
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: "value",
    title: "Best Value Prices",
    subtitle: "Affordable Quality",
    description: "Get premium quality jerseys at prices that won't break the bank. We believe quality should be accessible to everyone.",
    icon: <Crown className="w-8 h-8" />,
    benefits: [
      "Competitive pricing",
      "No hidden costs",
      "Regular discounts",
      "Value for money"
    ],
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    id: "shipping",
    title: "Pan India Delivery",
    subtitle: "Fast & Reliable",
    description: "We deliver to every state in India with fast, reliable shipping and real-time tracking for your peace of mind.",
    icon: <Award className="w-8 h-8" />,
    benefits: [
      "All India delivery",
      "Fast shipping times",
      "Real-time tracking",
      "Secure packaging"
    ],
    gradient: "from-emerald-500/20 to-teal-500/20"
  },
  {
    id: "service",
    title: "Customer Satisfaction",
    subtitle: "Your Trust Matters",
    description: "We're committed to providing excellent customer service and ensuring you're completely satisfied with your purchase.",
    icon: <Gem className="w-8 h-8" />,
    benefits: [
      "Easy returns",
      "24/7 support",
      "Size guidance",
      "Satisfaction guarantee"
    ],
    gradient: "from-yellow-500/20 to-orange-500/20"
  }
];

const PremiumFeatures = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-6">
          <Badge variant="secondary" className="px-4 py-2 bg-primary/10 text-primary border-primary/20">
            <Star className="w-4 h-4 mr-2" />
            Why Choose Us
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="block text-foreground">Quality</span>
            <span className="block bg-gradient-primary bg-clip-text text-transparent">Affordability</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We believe everyone deserves quality football jerseys at fair prices. 
            That's why we offer the best value with nationwide shipping.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={feature.id}
              className={`group relative overflow-hidden border-0 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm transition-all duration-500 hover:shadow-glow cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setActiveFeature(feature.id)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-primary">{feature.subtitle}</p>
                      <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-all duration-300 ${
                      activeFeature === feature.id ? 'scale-110 bg-primary text-primary-foreground' : ''
                    }`}>
                      {feature.icon}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div
                        key={benefitIndex}
                        className={`flex items-center gap-3 transition-all duration-300 ${
                          activeFeature === feature.id 
                            ? 'opacity-100 translate-x-0' 
                            : 'opacity-70 translate-x-2'
                        }`}
                        style={{ transitionDelay: `${benefitIndex * 100}ms` }}
                      >
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-primary/5 transition-opacity duration-300 ${
                  activeFeature === feature.id ? 'opacity-100' : 'opacity-0'
                }`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Quality Guarantee</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">Pan India</div>
            <div className="text-sm text-muted-foreground">Shipping</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Customer Support</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">4.8★</div>
            <div className="text-sm text-muted-foreground">Customer Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumFeatures;