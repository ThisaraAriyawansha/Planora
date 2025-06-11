import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, Users } from 'lucide-react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState('');

  // Animation controls
  const controls = useAnimation();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/registrations/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: 'thisara.a2001@gmail.com', // Admin email
        }),
      });

      if (response.ok) {
        console.log('Form submitted:', formData);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideInFromLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const slideInFromRight = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const popIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <motion.section
        className="relative min-h-[60vh] text-white bg-fixed bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage: "url('https://wallpapers.com/images/featured/concert-background-dd0syeox7rmi78l0.jpg')",
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content */}
        <motion.div 
          className="relative max-w-4xl px-4 text-center sm:px-6 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="mb-6 font-serif text-3xl font-extrabold sm:text-4xl md:text-5xl"
            variants={itemVariants}
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            className="font-sans text-base font-light text-blue-100 sm:text-lg md:text-xl"
            variants={itemVariants}
          >
            Have questions or need help? We're here to assist you every step of the way.
          </motion.p>
        </motion.div>
      </motion.section>


      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 
              className="mb-8 text-3xl font-bold text-gray-900"
              variants={slideInFromLeft}
            >
              Let's Start a Conversation
            </motion.h2>
            <motion.p 
              className="mb-8 text-lg text-gray-600"
              variants={slideInFromLeft}
            >
              Whether you're looking to organize an event, need help with registration, or have feedback about our platform, 
              we'd love to hear from you.
            </motion.p>

            <motion.div 
              className="space-y-6"
              variants={containerVariants}
            >
              <motion.div 
                className="flex items-start space-x-4"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                  <p className="text-gray-600">support@planora.com</p>
                  <p className="text-sm text-gray-500">We'll get back to you within 24 hours</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-3 bg-green-100 rounded-lg">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                  <p className="text-gray-600">+94 11 234 5678</p>
                  <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM </p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start space-x-4"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Visit Us</h3>
                  <p className="text-gray-600">123 Event Street<br />Colombo, Sri Lanka</p>
                  <p className="text-sm text-gray-500">Open for scheduled meetings</p>
                </div>
              </motion.div>
            </motion.div>

            {/* FAQ Quick Links */}
            <motion.div 
              className="mt-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h3 
                className="mb-4 text-xl font-semibold text-gray-900"
                variants={slideInFromLeft}
              >
                Quick Help
              </motion.h3>
              <motion.div 
                className="grid grid-cols-1 gap-4"
                variants={containerVariants}
              >
                <motion.div 
                  className="p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">How do I create an event?</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Register as an organizer and use our intuitive event creation tools.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">How do I register for events?</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Simply browse events and click "Register Now" on any event page.
                  </p>
                </motion.div>

                <motion.div 
                  className="p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                >
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Need help with your account?</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Visit your dashboard or contact our support team for assistance.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="p-8 bg-white shadow-lg rounded-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={popIn}
          >
            <motion.h3 
              className="mb-6 text-2xl font-bold text-gray-900"
              variants={fadeIn}
            >
              Send us a Message
            </motion.h3>
            
            {error && (
              <motion.div 
                className="px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-400 rounded"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="event">Event Organization Help</option>
                  <option value="account">Account Issues</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="partnership">Partnership Opportunities</option>
                </select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSending}
                className={`flex items-center justify-center w-full px-6 py-3 space-x-2 font-semibold text-white rounded-lg transition-colors ${
                  isSending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                variants={itemVariants}
                whileHover={!isSending ? { scale: 1.02 } : {}}
                whileTap={!isSending ? { scale: 0.98 } : {}}
              >
                <Send className="w-5 h-5" />
                <span>{isSending ? 'Sending...' : 'Send Message'}</span>
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="w-full max-w-sm p-6 text-center bg-white rounded-lg shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="mb-4 text-green-600">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Message Sent!</h3>
            <p className="mb-4 text-gray-600">Thank you for your message. We'll get back to you soon.</p>
            <motion.button
              onClick={() => setShowSuccessPopup(false)}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Contact;