import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, ArrowRight, UtensilsCrossed, Filter } from 'lucide-react';
import CategoryFilter from '../components/CategoryFilter';
import ProductList from '../components/ProductList';
import api from '../services/api';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortOption]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let sortBy = undefined;
      let order = undefined;

      if (sortOption === 'price-asc') {
        sortBy = 'price';
        order = 'asc';
      } else if (sortOption === 'price-desc') {
        sortBy = 'price';
        order = 'desc';
      } else if (sortOption === 'newest') {
        sortBy = 'newest';
      }

      const { data } = await api.get('/products', {
        params: {
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          search: searchQuery || undefined,
          sortBy,
          order
        },
      });
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-gray-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1601050638917-3d8487b2030d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Authentic Indian Meal"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            {/* Left Column: Content */}
            <div className="text-white text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center lg:justify-start gap-3 text-orange-500 font-black mb-6 tracking-[0.3em] uppercase text-xs"
              >
                <div className="h-[2px] w-10 bg-orange-500"></div>
                -  Mannu Yadav
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-[5.5rem] font-black mb-8 leading-[0.9] tracking-tighter"
              >
                Artistic <span className="text-orange-600">Flavors</span> <br />
                At Your Doorstep
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-gray-300 mb-12 max-w-xl lg:mx-0 mx-auto leading-relaxed font-medium"
              >
                Experience the finest culinary creations from our top-rated chefs,
                made with fresh organic ingredients and delivered hot to your doorstep.
              </motion.p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 items-center">
                <button
                  onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-[2rem] font-black text-lg flex items-center gap-3 transition-all shadow-xl"
                >
                  Order Now <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Right Column: Static Image (Desktop Only) */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
                <img
                  src="/images/indian-heritage.png"
                  alt="Indian Culinary Heritage"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-600 rounded-[2.5rem] -z-10"></div>
            </div>
          </div>
        </div>

        {/* Floating Decorative Sphere - Kept but simplified */}
        <div className="absolute -right-20 -bottom-20 w-[40rem] h-[40rem] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      </section>

      {/* Categories & Menu Section */}
      <section id="menu-section" className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
              Explore Our <span className="text-orange-600">Menu</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Find your favorite dishes from our diverse collection of categories.
            </p>
          </motion.div>

          <div className="relative group w-full md:w-80">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none text-gray-700"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative group w-full md:w-64"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
              <Filter className="w-4 h-4" />
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none text-gray-700 font-bold appearance-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </motion.div>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="mt-12">
          <ProductList products={products} loading={loading} />
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-orange-600 py-16 mt-16 mb-4 overflow-hidden relative text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <h3 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
              Get <span className="underline decoration-white/30 truncate">20% Discount</span> On Your First Order!
            </h3>
            <p className="text-orange-100 text-base md:text-lg mb-8 opacity-90">
              Use code <span className="bg-white/20 px-3 py-1 rounded-lg font-mono font-bold">WELCOME20</span> at checkout.
            </p>
            <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              Claim Offer Now
            </button>
          </motion.div>

          <div className="w-full md:w-1/2 relative mt-12 md:mt-0">
            <div className="w-full lg:w-[120%] h-auto lg:-rotate-6 lg:scale-110">
              <img
                src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Featured Indian Biryani"
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
