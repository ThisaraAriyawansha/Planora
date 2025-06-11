import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, Clock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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
  images: string[];
  registrations_count: number;
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
        
        if (user) {
          const regResponse = await axios.get('http://localhost:5000/api/registrations/user');
          const userRegistrations = regResponse.data;
          setRegistered(userRegistrations.some((reg: any) => reg.id === parseInt(id || '0')));
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      await axios.post('http://localhost:5000/api/registrations', {
        event_id: event?.id
      });
      setRegistered(true);
      
      if (event) {
        setEvent({
          ...event,
          registrations_count: event.registrations_count + 1
        });
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center min-h-screen bg-gray-100"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-gray-900"
        ></motion.div>
      </motion.div>
    );
  }

  if (!event) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center min-h-screen bg-gray-100"
      >
        <div className="text-center">
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-semibold text-gray-900"
          >
            Event Not Found
          </motion.h2>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/events')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-all duration-300 bg-gray-900 rounded-full hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Events
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const isEventFull = event.registrations_count >= event.capacity;
  const spotsLeft = event.capacity - event.registrations_count;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen font-sans bg-gray-100"
    >
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] min-h-[500px]">
        {event.main_image ? (
          <motion.img
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={`http://localhost:5000${event.main_image}`}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-900 to-gray-700"
          >
            <Calendar className="w-24 h-24 text-white opacity-30" />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 px-6 py-12 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              onClick={() => navigate('/events')}
              whileHover={{ x: -5 }}
              className="inline-flex items-center mb-6 text-gray-200 transition-colors duration-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Events
            </motion.button>
            
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.4 } }}
              className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl"
            >
              {event.title}
            </motion.h1>
            
            {event.category && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { delay: 0.5 } }}
                className="inline-block px-4 py-1 mt-4 text-sm font-medium text-white rounded-full bg-white/10 backdrop-blur-sm"
              >
                {event.category}
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl px-4 py-16 mx-auto px livelli 10px-12 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-8 bg-white shadow-lg rounded-3xl"
        >
          {/* Event Info */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-8">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-start"
              >
                <Clock className="w-6 h-6 mt-1 mr-4 text-gray-900" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-500">{event.time}</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-start"
              >
                <MapPin className="w-6 h-6 mt-1 mr-4 text-gray-900" />
                <p className="text-lg text-gray-900">{event.location}</p>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-start"
              >
                <Users className="w-6 h-6 mt-1 mr-4 text-gray-900" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {event.registrations_count} / {event.capacity} registered
                  </p>
                  <p className="text-sm text-gray-500">
                    {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Event is full'}
                  </p>
                </div>
              </motion.div>

              {event.organizer_name && (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="flex items-start"
                >
                  <User className="w-6 h-6 mt-1 mr-4 text-gray-900" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Organized by</p>
                    <p className="text-sm text-gray-500">{event.organizer_name}</p>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex items-center justify-center"
            >
              {registered ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  </motion.div>
                  <p className="mb-2 text-xl font-semibold text-gray-900">You're Registered!</p>
                  <p className="text-sm text-gray-500">We'll see you at the event</p>
                </motion.div>
              ) : (
                <motion.button
                  onClick={handleRegister}
                  disabled={registering || isEventFull || !user}
                  whileHover={!isEventFull && user ? { scale: 1.05 } : {}}
                  whileTap={!isEventFull && user ? { scale: 0.95 } : {}}
                  className={`px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200 ${
                    isEventFull
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : !user
                      ? 'bg-gray-900 hover:bg-gray-800 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {registering ? (
                    <motion.span
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      Registering...
                    </motion.span>
                  ) : isEventFull ? (
                    'Event Full'
                  ) : !user ? (
                    'Login to Register'
                  ) : (
                    'Register Now'
                  )}
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Event Description */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="pt-10 mt-10 border-t border-gray-200"
          >
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">About This Event</h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="text-lg leading-relaxed text-gray-700"
            >
              {event.description}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Event Gallery */}
      {event.images && event.images.length > 0 && (
        <div className="w-full py-20 bg-white">
          <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10 text-3xl font-semibold text-center text-gray-900"
            >
              Event Gallery
            </motion.h2>
            <div className="flex flex-col items-center">
              {/* Main Image */}
              <div className="w-full max-w-5xl mx-auto mb-8">
                <motion.div 
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden bg-white shadow-lg rounded-3xl"
                >
                  <img
                    src={`http://localhost:5000${event.images[currentImageIndex]}`}
                    alt={`Event image ${currentImageIndex + 1}`}
                    className="object-cover w-full h-[50vh] sm:h-[60vh] md:h-[70vh]"
                  />
                  <div className="absolute px-3 py-1 text-sm font-medium text-white bg-gray-900 rounded-full bottom-4 right-4 bg-opacity-70">
                    {currentImageIndex + 1} / {event.images.length}
                  </div>
                </motion.div>
              </div>
              {/* Thumbnails */}
              <div className="w-full max-w-5xl mx-auto overflow-x-auto">
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex py-4 space-x-4"
                >
                  {event.images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className={`flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index ? 'border-gray-900 shadow-md' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EventDetail;