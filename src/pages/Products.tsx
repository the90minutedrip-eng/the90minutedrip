import { useEffect, useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import ProductCard from "@/components/ProductCard";
import { products, ProductCategory } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";

const categoryLabels: Record<ProductCategory, string> = {
  NEW_SEASON: "New Season",
  LEGEND: "Legends",
  RETRO: "Retro",
  SPECIAL_EDITION: "Special Edition",
};

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = "Products | The 90 Minute Drip";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Browse football jerseys: New Season, Legends, Retro, and Special Edition.");
  }, []);

  // Get min and max prices from products
  const priceExtents = useMemo(() => {
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, []);

  // Initialize price range based on actual product prices
  useEffect(() => {
    setPriceRange([priceExtents.min, priceExtents.max]);
  }, [priceExtents]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.team.toLowerCase().includes(query) ||
        p.season.toLowerCase().includes(query) ||
        categoryLabels[p.category].toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    return filtered;
  }, [selectedCategory, searchQuery, priceRange]);

  const clearFilters = () => {
    setSelectedCategory("ALL");
    setSearchQuery("");
    setPriceRange([priceExtents.min, priceExtents.max]);
  };

  const hasActiveFilters = selectedCategory !== "ALL" || searchQuery.trim() ||
    priceRange[0] !== priceExtents.min || priceRange[1] !== priceExtents.max;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: filteredProducts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        brand: 'The 90 Minute Drip',
        category: p.category,
        image: p.images[0],
        offers: { '@type': 'Offer', priceCurrency: 'INR', price: p.price, availability: 'https://schema.org/InStock' }
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto py-12 md:py-16">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold">Products</h1>
          <p className="text-muted-foreground">Shop our curated collection of football jerseys.</p>
        </header>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jerseys, teams, or seasons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 transition-all duration-200"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {[selectedCategory !== "ALL", searchQuery.trim(),
                      priceRange[0] !== priceExtents.min || priceRange[1] !== priceExtents.max]
                      .filter(Boolean).length}
                  </span>
                )}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="gap-2 text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                  Clear all
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <Card className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === "ALL" ? "default" : "outline"}
                      onClick={() => setSelectedCategory("ALL")}
                      className="transition-all duration-200"
                      size="sm"
                    >
                      All Products
                    </Button>
                    {Object.entries(categoryLabels).map(([category, label]) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category as ProductCategory)}
                        className="transition-all duration-200"
                        size="sm"
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={priceExtents.max}
                      min={priceExtents.min}
                      step={500}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                      <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* No products message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery.trim()
                  ? `No results for "${searchQuery}". Try adjusting your search or filters.`
                  : "No products match your current filters. Try adjusting your criteria."
                }
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    </div>
  );
};

export default Products;
