import Header from "@/components/layout/Header";
import SimpleFooter from "@/components/layout/SimpleFooter";
import CursorGlow from "@/components/CursorGlow";
import Hero from "@/components/sections/Hero";
import PremiumFeatures from "@/components/sections/PremiumFeatures";
import FadeInSection from "@/components/animations/FadeInSection";
import { Button } from "@/components/ui/button";

import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const Index = () => {
  const productList = products.slice(0, 6);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: productList.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        brand: 'The 90 Minute Drip',
        category: p.category,
        image: p.images[0],
        offers: { '@type': 'Offer', priceCurrency: 'USD', price: p.price, availability: 'https://schema.org/InStock' }
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CursorGlow />
      <main className="flex-1">
        <FadeInSection>
          <Hero />
        </FadeInSection>

        <FadeInSection direction="up" threshold={0.2} delay={100}>
          <section id="products" className="container mx-auto py-12 md:py-16">
            <header className="mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold">Best Value Jerseys</h2>
              <p className="text-muted-foreground">Quality jerseys at unbeatable prices. New Season, Legends, and more.</p>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productList.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
        </FadeInSection>

        <FadeInSection direction="up" threshold={0.2}>
          <section className="container mx-auto py-12 md:py-16 bg-card/30 rounded-xl border my-12">
            <header className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold">Quality Meets Affordability</h2>
              <p className="text-muted-foreground">Premium materials at competitive prices</p>
            </header>
            <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto text-center">
              <p>Our jerseys are crafted with quality materials and attention to detail, ensuring you get the best value for your money. Each jersey is designed for comfort and durability.</p>
              <div className="mt-6">
                <Button variant="default" size="lg">Shop Collection</Button>
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection direction="up" threshold={0.2} delay={200}>
          <PremiumFeatures />
        </FadeInSection>

        <FadeInSection direction="up" threshold={0.2} delay={300}>
          <section className="container mx-auto py-12 md:py-16 bg-card/30 rounded-xl border my-12">
            <header className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold">Pan India Shipping</h2>
              <p className="text-muted-foreground">Fast delivery across all states</p>
            </header>
            <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto text-center">
              <p>We deliver to every corner of India! From Kashmir to Kanyakumari, get your favorite jerseys delivered to your doorstep with reliable tracking and fast shipping.</p>
              <div className="mt-6">
                <Button variant="default" size="lg">Shipping Details</Button>
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection direction="up" threshold={0.2} delay={400}>
          <SimpleFooter />
        </FadeInSection>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    </div>
  );
};

export default Index;
