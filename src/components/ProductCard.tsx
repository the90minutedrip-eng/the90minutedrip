import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";
import { Link } from "react-router-dom";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import ProductImageCarousel from "./ProductImageCarousel";

const formatCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

const categoryLabel: Record<Product["category"], string> = {
  NEW_SEASON: "New Season",
  LEGEND: "Legend",
  RETRO: "Retro",
  SPECIAL_EDITION: "Special Edition",
};

export default function ProductCard({ product }: { product: Product }) {
  // Use all images and videos in the carousel
  const hasDiscount = !!product.originalPrice && product.originalPrice > product.price;

  const onAdd = () => {
    toast({ title: "Added to cart", description: `${product.name} added to cart.` });
  };

  return (
    <Card className="overflow-hidden group animate-enter">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/products/${product.id}`} aria-label={`${product.name} details`} className="block">
          <ProductImageCarousel 
            images={product.images}
            videos={product.videos || []}
            productName={product.name}
            className="transition-transform duration-300 group-hover:scale-[1.03]"
            aspectRatio="aspect-[4/3]"
            thumbnailSize={40}
          />
        </Link>
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{product.name}</CardTitle>
          {product.isLimitedEdition && (
            <Badge variant="secondary">Limited</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{categoryLabel[product.category]}</span>
          <span>•</span>
          <span>{product.team}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold">{formatCurrency(product.price)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.originalPrice!)}</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onAdd} size="sm" className="flex-grow sm:flex-grow-0">Add to cart</Button>
          <Button variant="outline" size="sm" asChild className="flex-grow sm:flex-grow-0">
            <a href={buildWhatsAppLink(product.name, product.id)} target="_blank" rel="noopener noreferrer" aria-label={`Buy ${product.name} on WhatsApp`}>
              Buy on WhatsApp
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
