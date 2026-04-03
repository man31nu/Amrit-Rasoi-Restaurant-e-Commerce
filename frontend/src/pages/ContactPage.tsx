import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Message sent! We will get back to you soon.', {
      icon: <CheckCircle2 className="text-green-500" />,
      style: {
        borderRadius: '12px',
        background: '#1a1a2e',
        color: '#e2e8f0',
      },
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfos = [
    { icon: <MapPin />, title: 'Visit Us', details: 'Sabour, Bhagalpur, Bihar', color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: <Phone />, title: 'Call Us', details: '+91 XXXX XXXX XX', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: <Mail />, title: 'Email Us', details: 'info@amrit_rasoi.com', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: <Clock />, title: 'Open Hours', details: 'Mon - Sun: 9AM - 11PM', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-8 bg-gray-50/30">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-4 bg-orange-100 rounded-2xl mb-6 text-orange-600"
          >
            <Mail className="w-8 h-8" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">Get in <span className="text-orange-600">Touch</span></h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">Have a question or feedback? We'd love to hear from you. Our team is usually responsive within 24 hours.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfos.map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 10 }}
                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-orange-600/5 transition-all"
              >
                <div className={`w-14 h-14 ${info.bg} ${info.color} rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110`}>
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{info.title}</h3>
                  <p className="text-lg font-black text-gray-900 tracking-tight">{info.details}</p>
                </div>
              </motion.div>
            ))}

            {/* Map Placeholder Card */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 aspect-square relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-white font-black text-2xl mb-4">Find Us on Google Maps</h4>
                <p className="text-white/60 mb-8 text-sm">Experience our artisan flavors in person. We are located in the heart of Bhagalpur.</p>
                <button className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-orange-600/30">
                  Get Directions
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 font-bold focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 font-bold focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 font-bold focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-[2rem] py-4 px-6 text-gray-900 font-bold focus:ring-4 focus:ring-orange-500/10 transition-all outline-none resize-none"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    disabled={isSubmitting}
                    className="group bg-orange-600 hover:bg-orange-700 text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-orange-600/30 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /> Send Message</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
