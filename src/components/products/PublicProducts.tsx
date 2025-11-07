import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, type Product } from "../../services/productService";

const PublicProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ limit: 8 });
      setProducts(response.data);

      // Select 3 random featured products
      const shuffled = [...response.data].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 3));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={
              i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"
            }
          >
            ⭐
          </span>
        ))}
        <span className="text-gray-600 text-sm ml-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Featured Products */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-elegant font-bold text-secondary-800 mb-4">
            ✨ Featured Beauty Finds
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Discover our most-loved products that are transforming beauty
            routines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product._id}
              className="card p-6 group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <div className="w-full h-48 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-6xl">
                      {product.category?.image || "🌸"}
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-secondary-800 text-lg line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-secondary-600 text-sm">{product.brand}</p>
                </div>

                {renderStars(product.ratings.average)}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary-600">
                      ${product.price}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-sm text-secondary-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <Link
                  to="/register"
                  className="w-full btn-primary text-center block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                >
                  Sign Up to Shop
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Products Grid */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-elegant font-bold text-secondary-800 mb-4">
            🛍️ Explore Our Collection
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Browse through our carefully curated selection of premium beauty
            products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="card p-4 group hover:shadow-lg transition-all duration-300"
            >
              <div className="w-full h-40 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center mb-4">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-4xl">
                    {product.category?.image || "🌸"}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-secondary-800 line-clamp-2 text-sm">
                  {product.name}
                </h3>
                <p className="text-secondary-600 text-xs">{product.brand}</p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">
                    ${product.price}
                  </span>
                  <div className="flex items-center text-xs text-secondary-600">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    {product.ratings.average.toFixed(1)}
                  </div>
                </div>

                <Link
                  to="/register"
                  className="w-full btn-secondary text-center block text-sm py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/register"
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            Join Now to Explore All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PublicProducts;
