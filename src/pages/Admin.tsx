import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { products as defaultProducts, Product, ProductCategory } from "@/data/products";
import { Plus, Edit, Trash2, Package, DollarSign, ShoppingCart, Loader2, Github, LogOut } from "lucide-react";
import GitHubConfig from "@/components/admin/GitHubConfig";
import ProductImagesManager from "@/components/admin/ProductImagesManager";
import AdminLogin from "@/components/admin/AdminLogin";
import { getProducts, saveProducts } from "@/lib/github-api";

const categoryLabels: Record<ProductCategory, string> = {
  NEW_SEASON: "New Season",
  LEGEND: "Legends",
  RETRO: "Retro",
  SPECIAL_EDITION: "Special Edition",
};

const formatCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [productList, setProductList] = useState<Product[]>(defaultProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGitHubConfigured, setIsGitHubConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "NEW_SEASON",
    team: "",
    season: "",
    price: 0,
    originalPrice: 0,
    images: [],
    videos: [],
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 0, M: 0, L: 0, XL: 0 },
    isLimitedEdition: false,
    discount: 0,
  });

  useEffect(() => {
    document.title = "Admin Dashboard | The 90 Minute Drip";
    
    // Check if user is already authenticated
    const isAdminAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    setIsAuthenticated(isAdminAuthenticated);
  }, []);

  // Load products from GitHub when configured
  useEffect(() => {
    if (isGitHubConfigured) {
      loadProductsFromGitHub();
    }
  }, [isGitHubConfigured]);

  const loadProductsFromGitHub = async () => {
    try {
      setIsLoading(true);
      const githubProducts = await getProducts();
      if (githubProducts && githubProducts.length > 0) {
        setProductList(githubProducts);
        toast({
          title: "Success",
          description: `Loaded ${githubProducts.length} products from GitHub`,
        });
      } else {
        // If no products found in GitHub, use the default products
        setProductList(defaultProducts);
        toast({
          title: "Info",
          description: "No products found in GitHub. Using default products.",
        });
      }
    } catch (error) {
      console.error("Error loading products from GitHub:", error);
      toast({
        title: "Error",
        description: "Failed to load products from GitHub. Check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images: string[], videos: string[]) => {
    setFormData(prev => ({
      ...prev,
      images,
      videos
    }));
  };

  const handleStockChange = (size: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      stock: { ...prev.stock, [size]: quantity }
    }));
  };

  const generateId = (name: string, team: string) => {
    return `${team.toLowerCase().replace(/\s+/g, '-')}-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.team || !formData.season || !formData.price) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || generateId(formData.name!, formData.team!),
      name: formData.name!,
      category: formData.category as ProductCategory,
      team: formData.team!,
      season: formData.season!,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      images: formData.images?.filter(img => img.trim()) || ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1600&auto=format&fit=crop"],
      videos: formData.videos?.filter(video => video.trim()) || [],
      sizes: formData.sizes || ["S", "M", "L", "XL"],
      stock: formData.stock || { S: 0, M: 0, L: 0, XL: 0 },
      isLimitedEdition: formData.isLimitedEdition || false,
      discount: formData.originalPrice && formData.price ? Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100) : 0,
    };

    let updatedProductList: Product[];
    
    if (editingProduct) {
      updatedProductList = productList.map(p => p.id === editingProduct.id ? productData : p);
      setProductList(updatedProductList);
      toast({ title: "Success", description: "Product updated successfully!" });
    } else {
      updatedProductList = [...productList, productData];
      setProductList(updatedProductList);
      toast({ title: "Success", description: "Product added successfully!" });
    }

    // Save to GitHub if configured
    if (isGitHubConfigured) {
      try {
        setIsSaving(true);
        await saveProducts(updatedProductList);
        toast({ title: "Success", description: "Products saved to GitHub!" });
      } catch (error) {
        console.error("Error saving to GitHub:", error);
        toast({ 
          title: "Warning", 
          description: "Products updated locally but failed to save to GitHub.",
          variant: "destructive"
        });
      } finally {
        setIsSaving(false);
      }
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    const updatedProductList = productList.filter(p => p.id !== productId);
    setProductList(updatedProductList);
    toast({ title: "Success", description: "Product deleted successfully!" });
    
    // Save to GitHub if configured
    if (isGitHubConfigured) {
      try {
        setIsSaving(true);
        await saveProducts(updatedProductList);
        toast({ title: "Success", description: "Products updated in GitHub!" });
      } catch (error) {
        console.error("Error saving to GitHub:", error);
        toast({ 
          title: "Warning", 
          description: "Product deleted locally but failed to update GitHub.",
          variant: "destructive"
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "NEW_SEASON",
      team: "",
      season: "",
      price: 0,
      originalPrice: 0,
      images: [],
      videos: [],
      sizes: ["S", "M", "L", "XL"],
      stock: { S: 0, M: 0, L: 0, XL: 0 },
      isLimitedEdition: false,
      discount: 0,
    });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const totalProducts = productList.length;
  const totalValue = productList.reduce((sum, product) => sum + product.price, 0);
  const lowStockProducts = productList.filter(product => 
    Object.values(product.stock).reduce((sum, stock) => sum + stock, 0) < 10
  ).length;

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {!isAuthenticated ? (
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      ) : (
      <main className="container mx-auto py-12 md:py-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        {/* GitHub Configuration */}
        <div className="mb-8">
          <GitHubConfig onConfigured={setIsGitHubConfigured} />
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading products from GitHub...</span>
          </div>
        )}
        
        {isSaving && (
          <div className="fixed bottom-4 right-4 bg-background border rounded-md p-3 shadow-md flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Saving to GitHub...</span>
          </div>
        )}
        <p className="text-muted-foreground">Manage your product inventory</p>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g., Manchester United Home 24/25"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="team">Team *</Label>
                    <Input
                      id="team"
                      value={formData.team}
                      onChange={(e) => handleInputChange("team", e.target.value)}
                      placeholder="e.g., Manchester United"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="season">Season *</Label>
                    <Input
                      id="season"
                      value={formData.season}
                      onChange={(e) => handleInputChange("season", e.target.value)}
                      placeholder="e.g., 2024/25"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="7399"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice || ""}
                      onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                      placeholder="9049"
                    />
                  </div>
                </div>

                <div>
                  <Label>Product Images & Videos</Label>
                  <ProductImagesManager
                    productId={editingProduct?.id || 'new-product'}
                    images={formData.images || []}
                    videos={formData.videos || []}
                    onChange={handleImagesChange}
                  />
                </div>

                <div>
                  <Label>Stock Quantities</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {["S", "M", "L", "XL"].map(size => (
                      <div key={size}>
                        <Label htmlFor={`stock-${size}`} className="text-sm">{size}</Label>
                        <Input
                          id={`stock-${size}`}
                          type="number"
                          value={formData.stock?.[size] || 0}
                          onChange={(e) => handleStockChange(size, Number(e.target.value))}
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isLimitedEdition"
                    checked={formData.isLimitedEdition}
                    onChange={(e) => handleInputChange("isLimitedEdition", e.target.checked)}
                  />
                  <Label htmlFor="isLimitedEdition">Limited Edition</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productList.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      {product.images.length > 1 && (
                        <Badge variant="secondary" className="absolute -top-2 -right-2">
                          {product.images.length}
                        </Badge>
                      )}
                      {product.videos && product.videos.length > 0 && (
                        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.team} • {product.season}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{categoryLabels[product.category]}</Badge>
                        {product.isLimitedEdition && <Badge variant="outline">Limited</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatCurrency(product.originalPrice)}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Stock: {Object.values(product.stock).reduce((sum, stock) => sum + stock, 0)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      )}
    </div>
  );
};

export default Admin;