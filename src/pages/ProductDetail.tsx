import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/cartContext";
import { getProduct, type Product } from "../services/productService";
import ProductReviews from "../components/reviews/ProductReviews";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productData = await getProduct(id!);
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Product not found.");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!product) {
      alert("Product not found");
      return;
    }

    addToCart(product, quantity);
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  const handleAddToWishlist = () => {
    if (!user) {
      alert("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    // TODO: Implement wishlist functionality
    alert(`Added ${product?.name} to wishlist!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-secondary-600 mt-4">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="card p-8 text-center">
            <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-4">
              Product Not Found
            </h2>
            <button
              onClick={() => navigate("/products")}
              className="btn-primary"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-6">
          <Link to="/dashboard" className="hover:text-primary-600">
            Dashboard
          </Link>
          <span>›</span>
          <Link to="/products" className="hover:text-primary-600">
            Products
          </Link>
          <span>›</span>
          <Link to={`/categories`} className="hover:text-primary-600">
            {product.category.name}
          </Link>
          <span>›</span>
          <span className="text-secondary-800">{product.name}</span>
        </nav>

        <div className="card p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="w-full h-96 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-6xl">{product.category.image}</span>
                )}
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedImage === index ? "ring-2 ring-primary-500" : ""
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {product.category.name}
                </span>
              </div>

              <h1 className="text-3xl font-elegant font-bold text-secondary-800 mb-2">
                {product.name}
              </h1>

              <p className="text-secondary-600 mb-4">by {product.brand}</p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(product.ratings.average)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-secondary-600">
                  {product.ratings.average.toFixed(1)} ({product.ratings.count}{" "}
                  reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-primary-600">
                    ${product.price}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-secondary-500 line-through">
                        ${product.originalPrice}
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                        Save $
                        {(product.originalPrice! - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>

              {/* Seller Info */}
              <div className="bg-secondary-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-secondary-600 mb-1">Sold by</p>
                <p className="font-semibold text-secondary-800">
                  {product.seller.name}
                </p>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4 mb-6">
                {product.stock > 0 ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-secondary-700">
                        Quantity:
                      </label>
                      <div className="flex items-center border border-secondary-300 rounded-lg">
                        <button
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, prev - 1))
                          }
                          className="px-3 py-2 text-secondary-600 hover:text-secondary-800"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 border-l border-r border-secondary-300">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity((prev) =>
                              Math.min(product.stock, prev + 1)
                            )
                          }
                          className="px-3 py-2 text-secondary-600 hover:text-secondary-800"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-secondary-500">
                        Max: {product.stock}
                      </span>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleAddToCart}
                        className="btn-primary flex-1"
                      >
                        🛒 Add to Cart
                      </button>
                      <button
                        onClick={handleAddToWishlist}
                        className="btn-secondary px-4"
                      >
                        ❤️
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    disabled
                    className="btn-primary flex-1 opacity-50 cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>

              {/* Features */}
              {product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-secondary-800 mb-2">
                    Key Features:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-secondary-600">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Tabs */}
          <div className="mt-8 border-t border-secondary-200 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Description */}
              <div>
                <h3 className="font-elegant font-semibold text-secondary-800 text-lg mb-3">
                  Description
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div>
                  <h3 className="font-elegant font-semibold text-secondary-800 text-lg mb-3">
                    Ingredients
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {product.ingredients}
                  </p>
                </div>
              )}

              {/* How to Use */}
              {product.howToUse && (
                <div>
                  <h3 className="font-elegant font-semibold text-secondary-800 text-lg mb-3">
                    How to Use
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {product.howToUse}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Seller Actions */}
          {user &&
            (user.role === "seller" || user.role === "admin") &&
            product.seller._id === user._id && (
              <div className="mt-8 pt-6 border-t border-secondary-200">
                <h3 className="font-elegant font-semibold text-secondary-800 text-lg mb-4">
                  Seller Actions
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      navigate(`/seller/edit-product/${product._id}`)
                    }
                    className="btn-secondary"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={() => navigate("/seller/products")}
                    className="btn-secondary"
                  >
                    View All Products
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <ProductReviews productId={product._id} productName={product.name} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
