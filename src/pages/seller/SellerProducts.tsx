import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getSellerProducts,
  type Product,
  deleteProduct,
} from "../../services/productService";
import { Link, useNavigate } from "react-router-dom";

const SellerProducts: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      const response = await getSellerProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching seller products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleteLoading(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { text: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (stock <= 10)
      return { text: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { text: "In Stock", color: "bg-green-100 text-green-800" };
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-secondary-600 mt-4">Loading your products...</p>
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
                My Products
              </h1>
              <p className="text-secondary-600 mt-2">
                Manage your beauty products and inventory
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/products")}
                className="btn-secondary"
              >
                Browse All Products
              </button>
              <Link to="/seller/create-product" className="btn-primary">
                Add New Product
              </Link>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {products.length > 0 ? (
          <div className="card p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-4 font-semibold text-secondary-800">
                      Product
                    </th>
                    <th className="text-left py-4 font-semibold text-secondary-800">
                      Category
                    </th>
                    <th className="text-left py-4 font-semibold text-secondary-800">
                      Price
                    </th>
                    <th className="text-left py-4 font-semibold text-secondary-800">
                      Stock
                    </th>
                    <th className="text-left py-4 font-semibold text-secondary-800">
                      Status
                    </th>
                    <th className="text-left py-4 font-semibold text-secondary-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <tr
                        key={product._id}
                        className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors"
                      >
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                              {product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              ) : (
                                <span className="text-primary-600">
                                  {product.category?.image || "🛍️"}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-secondary-800">
                                {product.name}
                              </div>
                              <div className="text-sm text-secondary-600">
                                {product.brand}
                              </div>
                              <div className="text-xs text-secondary-500">
                                SKU: {product.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <span>{product.category?.image}</span>
                            <span className="text-secondary-700">
                              {product.category?.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-secondary-800">
                              ${product.price}
                            </span>
                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <span className="text-sm text-secondary-500 line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}
                          >
                            {stockStatus.text}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                navigate(`/seller/edit-product/${product._id}`)
                              }
                              className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={deleteLoading === product._id}
                              className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              {deleteLoading === product._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-6 border-t border-secondary-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {products.length}
                  </div>
                  <div className="text-sm text-blue-800">Total Products</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {products.filter((p) => p.stock > 10).length}
                  </div>
                  <div className="text-sm text-green-800">In Stock</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      products.filter((p) => p.stock > 0 && p.stock <= 10)
                        .length
                    }
                  </div>
                  <div className="text-sm text-yellow-800">Low Stock</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {products.filter((p) => p.stock === 0).length}
                  </div>
                  <div className="text-sm text-red-800">Out of Stock</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-600 text-3xl">📦</span>
            </div>
            <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-4">
              No Products Yet
            </h2>
            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
              You haven't added any products yet. Start your selling journey by
              adding your first beauty product to the platform.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/seller/create-product" className="btn-primary">
                Add Your First Product
              </Link>
              <button className="btn-secondary" disabled>
                Learn About Selling
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;
