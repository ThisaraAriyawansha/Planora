import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, Clock, Search, Filter } from 'lucide-react';

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

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.map((event: Event) => event.category).filter(Boolean))] as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  return (
    <div className="min-h-screen py-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Discover Events</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Find and join amazing events happening in your area
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
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
                  {event.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-sm font-medium text-gray-800 rounded-full bg-white/90">
                        {event.category}
                      </span>
                    </div>
                  )}
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
                  <div className="flex items-center mb-2 text-gray-600">
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
                      className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                  {event.organizer_name && (
                    <div className="pt-3 mt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Organized by <span className="font-medium">{event.organizer_name}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No Events Found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search criteria'
                : 'No events are currently available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;