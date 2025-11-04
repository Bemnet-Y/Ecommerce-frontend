import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-primary-100">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-elegant font-bold text-primary-700">
                  BloomBeauty
                </h1>
                <p className="text-xs text-secondary-500 -mt-1">
                  Cosmetics & Skincare
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-elegant font-bold text-secondary-800 leading-tight mb-6">
              Discover Your
              <span className="text-primary-600"> Natural Beauty</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Experience the perfect blend of luxury and nature with our premium
              skincare, exquisite makeup, and heavenly fragrances. Your journey
              to radiant beauty starts here.
            </p>
            <div className="flex justify-center space-x-4 mb-12">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Start Your Journey ✨
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-100 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-r from-pink-100 to-transparent opacity-30"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-elegant font-bold text-secondary-800 mb-4">
              Why Choose BloomBeauty?
            </h2>
            <p className="text-secondary-600 text-lg">
              Experience the difference of premium beauty care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-elegant font-semibold text-secondary-800 mb-3">
                Natural Ingredients
              </h3>
              <p className="text-secondary-600">
                Our products are crafted with the finest natural ingredients,
                carefully selected for their beneficial properties.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💫</span>
              </div>
              <h3 className="text-xl font-elegant font-semibold text-secondary-800 mb-3">
                Luxury Experience
              </h3>
              <p className="text-secondary-600">
                Indulge in our luxurious formulations that pamper your skin and
                elevate your daily beauty routine.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-elegant font-semibold text-secondary-800 mb-3">
                Expert Curated
              </h3>
              <p className="text-secondary-600">
                Each product is expertly curated and tested to ensure the
                highest quality and effectiveness for your skin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-elegant font-bold text-secondary-800 mb-4">
              Explore Our Collections
            </h2>
            <p className="text-secondary-600 text-lg">
              Find your perfect beauty match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Skincare", emoji: "✨", desc: "Nourish & Protect" },
              { name: "Makeup", emoji: "💄", desc: "Express Yourself" },
              { name: "Fragrance", emoji: "🌸", desc: "Signature Scents" },
              { name: "Bath & Body", emoji: "🛁", desc: "Pamper & Relax" },
            ].map((category, index) => (
              <div
                key={index}
                className="card p-6 text-center group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary-300 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary-400 group-hover:to-primary-600 transition-all">
                  <span className="text-white text-3xl">{category.emoji}</span>
                </div>
                <h3 className="text-xl font-elegant font-semibold text-secondary-800 mb-2">
                  {category.name}
                </h3>
                <p className="text-secondary-600">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-elegant font-bold text-white mb-6">
            Ready to Transform Your Beauty Routine?
          </h2>
          <p className="text-primary-100 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of beauty enthusiasts who have discovered their
            perfect glow with BloomBeauty
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 hover:bg-gray-50 font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
          >
            Create Your Account Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-elegant font-bold">BloomBeauty</span>
          </div>
          <p className="text-secondary-400">
            &copy; 2024 BloomBeauty. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
