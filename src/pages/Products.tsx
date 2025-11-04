import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getProducts,
  type Product,
  type ProductFilters,
} from "../services/productService";
import { getCategories, type Category } from "../services/categoryService";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/cartContext";
const Products: React.FC = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts(filters);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  };

  const handleCategoryFilter = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      category: categoryId === "all" ? undefined : categoryId,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12 });
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-secondary-600 mt-4">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-elegant font-bold text-secondary-800">
                Beauty Products
              </h1>
              <p className="text-secondary-600 mt-2">
                Discover amazing beauty products from our sellers
              </p>
            </div>
            {user?.role === "seller" && (
              <Link to="/seller/create-product" className="btn-primary">
                Add Product
              </Link>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                <button type="submit" className="btn-primary">
                  Search
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <select
              value={filters.category || "all"}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {(filters.search || filters.category) && (
              <button onClick={clearFilters} className="btn-secondary">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="card p-4 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
              >
                {/* Product Image */}
                <div className="w-full h-48 bg-primary-50 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-4xl">
                      {product.category?.image || "🛍️"}
                    </span>
                  )}
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Sale
                      </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="mb-3">
                  <h3 className="font-semibold text-secondary-800 text-lg mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-secondary-600 text-sm mb-2">
                    {product.brand}
                  </p>
                  <p className="text-xs text-secondary-500 mb-2">
                    By {product.seller.name}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-primary-600">
                      ${product.price}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-sm text-secondary-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                  </div>

                  {/* Stock */}
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-secondary-600 ml-1">
                        {product.ratings.average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (product.stock > 0) {
                        addToCart(product);
                        alert(`Added ${product.name} to cart!`);
                      }
                    }}
                    className="btn-primary flex-1 text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Add to wishlist functionality
                      alert(`Added ${product.name} to wishlist!`);
                    }}
                    className="btn-secondary p-2"
                  >
                    ♡
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-600 text-3xl">🛍️</span>
            </div>
            <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-4">
              No Products Found
            </h2>
            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
              {filters.search || filters.category
                ? "No products match your search criteria. Try adjusting your filters."
                : "No products have been added to the platform yet. Check back soon!"}
            </p>
            {(filters.search || filters.category) && (
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Load More (if needed) */}
        {products.length > 0 && (
          <div className="text-center mt-8">
            <button className="btn-secondary" disabled>
              Load More (Coming Soon)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
