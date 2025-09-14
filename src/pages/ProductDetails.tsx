import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { products, type Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import ProductImageCarousel from "@/components/ProductImageCarousel";

const formatCurrency = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);

const categoryLabel: Record<Product["category"], string> = {
  NEW_SEASON: "New Season",
  LEGEND: "Legend",
  RETRO: "Retro",
  SPECIAL_EDITION: "Special Edition",
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const product = useMemo(() => products.find(p => p.id === id), [id]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | The 90 Minute Drip`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", `${product.name} - ${product.team} ${product.season}. Buy on WhatsApp.`);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto py-16">
          <p>Product not found. <Link to="/products" className="story-link">Back to Products</Link></p>
        </main>
      </div>
    );
  }

  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: 'The 90 Minute Drip',
    category: product.category,
    image: product.images[0],
    offers: { '@type': 'Offer', priceCurrency: 'USD', price: product.price, availability: 'https://schema.org/InStock' }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg overflow-hidden border bg-card">
            <ProductImageCarousel
              images={product.images}
              videos={product.videos || []}
              productName={product.name}
              className="w-full"
              aspectRatio="aspect-square"
            />
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl md:text-3xl">{product.name}</CardTitle>
                {product.isLimitedEdition && <Badge variant="secondary">Limited</Badge>}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{categoryLabel[product.category]}</span>
                <span>•</span>
                <span>{product.team}</span>
                <span>•</span>
                <span>{product.season}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold">{formatCurrency(product.price)}</span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.originalPrice!)}</span>
                )}
              </div>

              <div>
                <h2 className="font-medium mb-3">Select size</h2>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const inStock = product.stock[size] > 0;
                    const selected = selectedSize === size;
                    return (
                      <Button
                        key={size}
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        disabled={!inStock}
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={selected}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a
                    href={buildWhatsAppLink(product.name, product.id, selectedSize || undefined)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Buy ${product.name} on WhatsApp${selectedSize ? `, size ${selectedSize}` : ''}`}
                  >
                    Buy on WhatsApp
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/products">Back to Products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    </div>
  );
};

export default ProductDetails;
