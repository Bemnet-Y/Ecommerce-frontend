import React from "react";
import { Link } from "react-router-dom";
import PublicProducts from "../components/products/PublicProducts";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-50">
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-pink-50">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-primary-200 mb-8">
              <span className="text-primary-600">✨</span>
              <span className="text-primary-700 font-semibold">
                Trusted by 10,000+ beauty enthusiasts
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-elegant font-bold text-secondary-800 leading-tight mb-6">
              Discover Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-pink-500">
                {" "}
                Natural Glow
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-secondary-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Experience the perfect blend of luxury and nature with our premium
              skincare, exquisite makeup, and heavenly fragrances. Your journey
              to radiant beauty starts here.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4 group"
              >
                Start Your Journey
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  ✨
                </span>
              </Link>
              <Link to="#products" className="btn-secondary text-lg px-8 py-4">
                Explore Products
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {[
                { number: "500+", label: "Premium Products" },
                { number: "50+", label: "Beauty Brands" },
                { number: "10K+", label: "Happy Customers" },
                { number: "24/7", label: "Beauty Support" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-secondary-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-100 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-r from-pink-100 to-transparent opacity-30"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-elegant font-bold text-secondary-800 mb-4">
              Why Choose BloomBeauty?
            </h2>
            <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
              We're committed to bringing you the finest beauty experience with
              quality you can trust
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌿",
                title: "Natural Ingredients",
                description:
                  "Our products are crafted with the finest natural ingredients, carefully selected for their beneficial properties.",
                features: [
                  "Cruelty-free",
                  "Sustainable sourcing",
                  "Clean beauty standards",
                ],
              },
              {
                icon: "💫",
                title: "Luxury Experience",
                description:
                  "Indulge in our luxurious formulations that pamper your skin and elevate your daily beauty routine.",
                features: [
                  "Premium packaging",
                  "Expert curation",
                  "Luxury textures",
                ],
              },
              {
                icon: "❤️",
                title: "Expert Curated",
                description:
                  "Each product is expertly curated and tested to ensure the highest quality and effectiveness for your skin.",
                features: [
                  "Beauty expert approved",
                  "Quality tested",
                  "Customer loved",
                ],
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card p-8 text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-white text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-elegant font-semibold text-secondary-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-primary-600 text-sm flex items-center justify-center"
                    >
                      <span className="mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="py-16 bg-gradient-to-br from-primary-50 to-pink-50"
      >
        <div className="container mx-auto px-6">
          <PublicProducts />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-elegant font-bold text-secondary-800 mb-4">
              How It Works
            </h2>
            <p className="text-secondary-600 text-lg">
              Start your beauty journey in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                icon: "📝",
                title: "Create Account",
                description: "Sign up in seconds and join our beauty community",
              },
              {
                step: "02",
                icon: "🛍️",
                title: "Browse Products",
                description:
                  "Explore our curated collection of premium beauty products",
              },
              {
                step: "03",
                icon: "🚚",
                title: "Get Delivered",
                description:
                  "Receive your beauty essentials right at your doorstep",
              },
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {step.step}
                </div>
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-elegant font-semibold text-secondary-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-secondary-600">{step.description}</p>

                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-pink-200 transform translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-elegant font-bold mb-6">
            Ready to Transform Your Beauty Routine?
          </h2>
          <p className="text-primary-100 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of beauty enthusiasts who have discovered their
            perfect glow with BloomBeauty
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-50 font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
            >
              Create Your Account Today
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-200"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-xl font-elegant font-bold">
                  BloomBeauty
                </span>
              </div>
              <p className="text-secondary-400 text-sm">
                Your trusted partner in beauty and self-care. Discover products
                that make you feel confident and beautiful.
              </p>
            </div>

            {[
              {
                title: "Shop",
                links: ["Skincare", "Makeup", "Fragrance", "Bath & Body"],
              },
              {
                title: "Support",
                links: [
                  "Contact Us",
                  "Shipping Info",
                  "Returns",
                  "Beauty Advice",
                ],
              },
              {
                title: "Company",
                links: ["About Us", "Sustainability", "Careers", "Press"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href="#"
                        className="text-secondary-400 hover:text-white transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-secondary-700 mt-8 pt-8 text-center">
            <p className="text-secondary-400 text-sm">
              &copy; 2024 BloomBeauty. All rights reserved. Made with ❤️ for
              beauty enthusiasts everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
