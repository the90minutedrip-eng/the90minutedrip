import { Link } from "react-router-dom";
import { ShoppingCart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container mx-auto flex items-center justify-between h-16">
        <Link to="/" className="font-semibold text-lg tracking-tight hover-scale" aria-label="Home">
          The 90 Minute Drip
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm story-link">Home</Link>
          <Link to="/products" className="text-sm story-link">Products</Link>
          <Link to="/about" className="text-sm story-link">About</Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Admin" asChild>
            <Link to="/admin">
              <Settings />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCart />
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
