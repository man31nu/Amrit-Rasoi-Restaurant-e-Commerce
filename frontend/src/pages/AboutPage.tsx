import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Award, Users, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Year of Excellence', value: '1+', icon: Award },
    { label: 'Master Chefs', value: '3', icon: UtensilsCrossed },
    { label: 'Happy Customers', value: '1k+', icon: Heart },
    { label: 'Expert Staff', value: '10+', icon: Users },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585933334452-f1f034091986?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Indian Spices"
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-gray-900"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-orange-500 font-black tracking-[0.4em] uppercase text-xs mb-4 block">The Soul of Indian Flavor</span>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8">
              Heritage <span className="text-orange-600">&</span> Spice
            </h1>
            <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl font-medium leading-relaxed">
              Crafting authentic Indian experiences through traditional techniques and hand-picked spices since our very first day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20 border-b border-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <stat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 relative">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="/images/indian-heritage.png"
                  alt="Indian Culinary Heritage"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-600 rounded-[2.5rem] -z-10 hidden md:block"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 space-y-8"
            >
              <h2 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter">
                Our <span className="text-orange-600">Indian</span> Narrative <br />
                A Journey of Taste.
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg font-medium">
                <p>
                  Started just over a year ago with a burning passion for the diverse culinary landscape of India, we set out to redefine what "Artisan Indian" means. Our story is written in the aromas of freshly ground cardamom, the sizzle of the Tandoor, and the vibrant colors of our curries.
                </p>
                <p>
                  Every recipe in our kitchen is a tribute to the masters of Indian cuisine. We source our spices directly from the hills of Kerala and the plains of Rajasthan, ensuring that the soul of India is present in every bite you take.
                </p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-orange-600 transition-all shadow-xl group"
              >
                Taste the Heritage <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="pt-24 pb-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">The Indian <span className="text-orange-600">Masters</span></h2>
            <p className="text-gray-500 max-w-xl mx-auto font-bold uppercase text-base tracking-widest leading-loose">The visionaries behind our premium Indian menu and exceptional dining experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: 'Vikram Malhotra', role: 'Executive Chef', img: '/images/vikram.png' },
              { name: 'Ananya Iyer', role: 'Head of Spices', img: '/images/ananya.png' },
              { name: 'Arjun Kapoor', role: 'Master of Tandoor', img: '/images/arjun.png' },
            ].map((chef, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group overflow-hidden rounded-[3rem] shadow-2xl shadow-orange-900/10 border border-gray-100"
              >
                <img src={chef.img} alt={chef.name} className="w-full h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-3xl font-black text-white mb-2">{chef.name}</h4>
                  <p className="text-orange-500 font-black uppercase text-sm tracking-[0.3em]">{chef.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
