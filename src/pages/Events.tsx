import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, Clock, Search, Star, Heart, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  preference: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Get user info from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        fetchUserData(payload.userId);
      } catch (error) {
        console.error('Error parsing token:', error);
        tryGetUserFromToken();
      }
    }
  }, []);

  const tryGetUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.userId,
          email: '',
          name: '',
          role: payload.role,
          preference: ''
        });
      } catch (error) {
        console.error('Error getting user from token:', error);
      }
    }
  };

  const fetchUserData = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/users/rec/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      tryGetUserFromToken();
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
        
        const uniqueCategories = [...new Set(response.data.map((event: Event) => event.category).filter(Boolean))] as string[];
        setCategories(uniqueCategories);

        if (user?.preference && user.preference.trim() !== '') {
          const recommended = response.data.filter((event: Event) => 
            event.category && event.category.toLowerCase() === user.preference.toLowerCase()
          );
          setRecommendedEvents(recommended.slice(0, 6));
        } else {
          setRecommendedEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const EventCard: React.FC<{ event: Event; isRecommended?: boolean }> = ({ event, isRecommended = false }) => (
    <Link to={`/events/${event.id}`}>
      <article className={`group cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${isRecommended ? 'relative' : ''}`}>
        {isRecommended && (
          <div className="absolute z-10 -top-3 -right-3">
            <div className="flex items-center gap-1 px-3 py-1 text-xs font-semibold border rounded-full shadow-sm bg-amber-100 text-amber-800 border-amber-300">
              <Star className="w-3 h-3 fill-amber-500" />
              Recommended
            </div>
          </div>
        )}
        
        {/* Image */}
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-t-2xl bg-gray-100">
          {event.main_image ? (
            <img
              src={`http://localhost:5000${event.main_image}`}
              alt={event.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
              <Calendar className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/30 to-transparent group-hover:opacity-100" />
          
          {/* Capacity Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-900 rounded-full shadow-sm bg-white/95">
              <Users className="w-4 h-4 mr-1" />
              {event.capacity} spots
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 space-y-3">
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-indigo-600">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{event.location}</span>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
            {event.description}
          </p>

          {/* Category & Organizer */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              {event.category && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-indigo-700 rounded-full bg-indigo-50">
                  {event.category}
                </span>
              )}
              {event.organizer_name && (
                <p className="text-xs text-gray-500">
                  Organized by {event.organizer_name}
                </p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-500 transition-transform group-hover:translate-x-2" />
          </div>
        </div>
      </article>
    </Link>
  );


    // Animation variants for header
  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        className="max-w-4xl px-4 py-8 mx-auto md:max-w-5xl sm:px-6 lg:px-8 sm:pt-12 sm:pb-16"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div className="text-center">
          <motion.h1
            className="text-3xl tracking-tight text-gray-900 sm:text-4xl"
            variants={childVariants}
          >
            Upcoming Events
          </motion.h1>
          <motion.p
            className="max-w-xl mx-auto mt-3 text-base leading-relaxed text-gray-600 sm:mt-4 sm:max-w-2xl"
            variants={childVariants}
          >
            Discover exceptional experiences designed for growth, learning, and connection.
          </motion.p>
        </div>
      </motion.header>

      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        {/* Recommended Events Section */}
        {user && user.preference && user.preference.trim() !== '' && recommendedEvents.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Heart className="w-5 h-5 text-rose-500" />
              <h2 className="text-2xl font-light text-gray-900">
                Recommended for You
              </h2>
              <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
                {user.preference}
              </span>
            </div>
            <div className="grid gap-8 mb-16 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedEvents.map((event) => (
                <EventCard key={`rec-${event.id}`} event={event} isRecommended={true} />
              ))}
            </div>
            <div className="border-b border-gray-200"></div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col gap-6 mb-16 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-gray-900 border-0 rounded-full ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('')}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === ''
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="pb-24">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-gray-300 rounded-full border-t-gray-900 animate-spin"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No events found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory
                  ? 'Try adjusting your search criteria'
                  : 'No events are currently available'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;