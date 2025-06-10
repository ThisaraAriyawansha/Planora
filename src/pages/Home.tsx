import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, ArrowRight, Star, Clock, Music, Cpu, Utensils, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  main_image: string;
  category: string;
  organizer_name: string;
}

const Home: React.FC = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setFeaturedEvents(response.data.slice(0, 3)); // Get first 3 events
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
          <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-[110vh] flex items-center text-white bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 relative mt-0 lg:-mt-20"
        style={{
          backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/038/817/316/non_2x/ai-generated-minimalist-image-showcasing-the-classic-form-and-elegance-of-a-black-piano-against-a-neutral-background-free-photo.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundBlendMode: 'overlay'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-10 bg-black"
        ></motion.div>
        <div className="relative z-20 w-full mx-auto max-w-7xl">
          <div className="max-w-2xl px-4 py-10 text-center sm:px-6 sm:py-12 md:py-16 md:text-left lg:py-20">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Planora
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="mb-6 font-sans text-base text-blue-100 sm:text-lg md:text-xl"
            >
              Find and join unforgettable events, from concerts to conferences.
            </motion.p>
            <motion.div
              className="flex flex-col justify-center gap-5 sm:flex-row sm:gap-4 md:justify-start"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.7, y: 20 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: 'backOut',
                    },
                  },
                }}
              >
                <Link
                  to="/events"
                  className="px-4 py-2 font-sans text-sm font-medium text-gray-700 transition-all duration-300 bg-white rounded-md shadow sm:text-base hover:bg-gray-100 hover:scale-105"
                >
                  Explore
                </Link>
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.7, y: 20 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: 'backOut',
                    },
                  },
                }}
              >
                <Link
                  to="/register"
                  className="px-4 py-2 font-sans text-sm font-medium text-white transition-all duration-300 bg-transparent border border-white rounded-md sm:text-base hover:bg-white hover:text-gray-700"
                >
                  Join
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Why Choose Planora?</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              We make event discovery and management simple, efficient, and enjoyable for everyone.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 text-center transition-shadow rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Easy Discovery</h3>
              <p className="text-gray-600">
                Find events that match your interests with our intuitive search and filtering system.
              </p>
            </div>

            <div className="p-6 text-center transition-shadow rounded-xl bg-gradient-to-br from-gray-100 to-stone-200 hover:shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-stone-700">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Seamless Registration</h3>
              <p className="text-gray-600">
                Register for events with just a few clicks and manage all your bookings in one place.
              </p>
            </div>

            <div className="p-6 text-center transition-shadow rounded-xl bg-gradient-to-br from-gray-100 to-zinc-200 hover:shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Quality Events</h3>
              <p className="text-gray-600">
                All events are curated and verified to ensure you have the best possible experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Featured Events</h2>
            <p className="text-xl text-gray-600">Don't miss out on these upcoming amazing events</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <div
                  key={event.id}
                  className="overflow-hidden transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl group"
                >
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                    {event.main_image ? (
                      <img
                        src={`http://localhost:5000${event.main_image}`}
                        alt={event.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Calendar className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-20 group-hover:bg-opacity-30"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{event.time}</span>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                      {event.title}
                    </h3>
                    <div className="flex items-center mb-3 text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Capacity: {event.capacity}</span>
                      </div>
                      <Link
                        to={`/events/${event.id}`}
                        className="flex items-center text-sm fontΜ-semibold text-blue-600 transition-colors hover:text-blue-700"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/events"
              className="inline-flex items-center px-8 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              View All Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
            <section 
            className="relative py-20 text-white bg-gradient-to-r from-blue-600 to-purple-700"
            style={{
              backgroundImage: "url('https://wallpapercat.com/w/full/d/7/2/1161021-3840x2160-desktop-4k-concert-background-photo.jpg')",
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
              <h2 className="mb-4 text-4xl font-bold">Ready to Get Started?</h2>
              <p className="mb-8 text-xl text-blue-100">
                Join our community today and start discovering amazing events in your area.
              </p>
              <Link
                to="/register"
                className="inline-block px-6 py-4 text-sm font-semibold text-white transition-all duration-300 bg-transparent border border-white rounded-lg shadow-lg hover:bg-white hover:text-gray-500 hover:scale-105"
              >
                Create Your Account
              </Link>
            </div>
          </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Hear from our Sri Lankan community about their experiences with Planora.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 transition-shadow shadow-md bg-gray-50 rounded-xl hover:shadow-lg">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="mb-4 italic text-gray-600">
                "Planora helped me find a classical music show in Colombo that I didn’t even know was happening. Great experience!"
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 font-semibold text-white bg-blue-600 rounded-full">
                  KM
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Kavindu Madushan</p>
                  <p className="text-sm text-gray-500">Music Lover</p>
                </div>
              </div>
            </div>
            <div className="p-6 transition-shadow shadow-md bg-gray-50 rounded-xl hover:shadow-lg">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-gray-300" />
              </div>
              <p className="mb-4 italic text-gray-600">
                "Registering for events through Planora is simple and fast. I love being able to keep all my tickets organized!"
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 font-semibold text-white bg-purple-600 rounded-full">
                  NS
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Nimali Silva</p>
                  <p className="text-sm text-gray-500">Event Goer from Galle</p>
                </div>
              </div>
            </div>
            <div className="p-6 transition-shadow shadow-md bg-gray-50 rounded-xl hover:shadow-lg">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="mb-4 italic text-gray-600">
                "Organizing my tech meetup in Kandy with Planora was a breeze. The platform made everything easier to manage."
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 font-semibold text-white bg-green-600 rounded-full">
                  RA
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Ruwani Abeysekara</p>
                  <p className="text-sm text-gray-500">Tech Event Organizer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Newsletter Signup Section */}
      <section className="py-20 text-white bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold">Stay in the Loop</h2>
          <p className="mb-8 text-xl text-gray-300">
            Subscribe to our newsletter for the latest event updates, exclusive offers, and more.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-80"
            />
            <button
              className="px-6 py-3 font-semibold text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Explore Popular Categories</h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Discover events tailored to your interests across a variety of categories.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/events?category=music"
              className="p-6 transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl hover:scale-105"
            >
              <div className="flex items-center justify-center h-40 mb-4 bg-gray-200 rounded-lg">
                <Music className="w-16 h-16 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Music & Concerts</h3>
              <p className="text-gray-600">From rock to jazz, find live performances that move you.</p>
            </Link>
            <Link
              to="/events?category=tech"
              className="p-6 transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl hover:scale-105"
            >
              <div className="flex items-center justify-center h-40 mb-4 bg-gray-200 rounded-lg">
                <Cpu className="w-16 h-16 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Tech & Innovation</h3>
              <p className="text-gray-600">Explore conferences and workshops on cutting-edge technology.</p>
            </Link>
            <Link
              to="/events?category=food"
              className="p-6 transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl hover:scale-105"
            >
              <div className="flex items-center justify-center h-40 mb-4 bg-gray-200 rounded-lg">
                <Utensils className="w-16 h-16 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Food & Drink</h3>
              <p className="text-gray-600">Savor culinary events, tastings, and cooking classes.</p>
            </Link>
            <Link
              to="/events?category=art"
              className="p-6 transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl hover:scale-105"
            >
              <div className="flex items-center justify-center h-40 mb-4 bg-gray-200 rounded-lg">
                <Palette className="w-16 h-16 text-gray-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Art & Culture</h3>
              <p className="text-gray-600">Immerse yourself in gallery openings and cultural festivals.</p>
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;