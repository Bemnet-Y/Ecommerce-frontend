import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getCategories,
  createCategory,
  type Category,
} from "../services/categoryService";

const Categories: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "🌸",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCategory = await createCategory(formData);
      setCategories((prev) => [...prev, newCategory]);
      setFormData({ name: "", description: "", image: "🌸" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Error creating category. It might already exist.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const emojiOptions = ["🌸", "💄", "🌟", "🛁", "✨", "💫", "❤️", "🔥"];

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="card p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-secondary-600 mt-4">Loading categories...</p>
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
                Product Categories
              </h1>
              <p className="text-secondary-600 mt-2">
                Browse our beauty categories and discover amazing products
              </p>
            </div>
            {user?.role === "admin" && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="btn-primary"
              >
                {showCreateForm ? "Cancel" : "Add Category"}
              </button>
            )}
          </div>
        </div>

        {/* Create Category Form (Admin Only) */}
        {showCreateForm && user?.role === "admin" && (
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-4">
              Create New Category
            </h2>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="e.g., Skincare, Makeup"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category Icon
                  </label>
                  <select
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    {emojiOptions.map((emoji) => (
                      <option key={emoji} value={emoji}>
                        {emoji}{" "}
                        {emoji === "🌸"
                          ? "Flower"
                          : emoji === "💄"
                          ? "Lipstick"
                          : emoji === "🌟"
                          ? "Star"
                          : emoji === "🛁"
                          ? "Bath"
                          : emoji}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Describe this category..."
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Create Category
              </button>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="card p-6 text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary-300 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary-400 group-hover:to-primary-600 transition-all">
                  <span className="text-white text-3xl">{category.image}</span>
                </div>
                <h3 className="text-xl font-elegant font-semibold text-secondary-800 mb-2">
                  {category.name}
                </h3>
                <p className="text-secondary-600 text-sm mb-4">
                  {category.description}
                </p>
                <button className="btn-secondary w-full text-sm py-2 opacity-50 cursor-not-allowed">
                  Browse Products (Coming Soon)
                </button>
                {user?.role === "admin" && (
                  <div className="mt-3 pt-3 border-t border-secondary-100">
                    <span className="text-xs text-secondary-500">
                      Created:{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-600 text-3xl">📂</span>
            </div>
            <h2 className="text-2xl font-elegant font-bold text-secondary-800 mb-4">
              No Categories Yet
            </h2>
            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
              {user?.role === "admin"
                ? "Start by creating your first product category to organize your beauty products."
                : "Categories will be available soon. Check back later to browse products by category."}
            </p>
            {user?.role === "admin" && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary"
              >
                Create First Category
              </button>
            )}
          </div>
        )}

        {/* Info for Non-Admin Users */}
        {categories.length > 0 && user?.role !== "admin" && (
          <div className="card p-6 mt-8 text-center">
            <p className="text-secondary-600">
              🚧 Product browsing by category is coming soon! We're working hard
              to bring you the best beauty shopping experience.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
