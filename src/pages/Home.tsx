import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, ArrowRight, Star, Clock } from 'lucide-react';

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
        <section className="min-h-[110vh] flex items-center text-white bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 relative mt-0 lg:-mt-20" style={{ backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/038/817/316/non_2x/ai-generated-minimalist-image-showcasing-the-classic-form-and-elegance-of-a-black-piano-against-a-neutral-background-free-photo.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundBlendMode: 'overlay' }}>
          <div className="absolute inset-0 z-10 bg-black opacity-30"></div>
          <div className="relative z-20 w-full mx-auto max-w-7xl">
            <div className="max-w-2xl px-4 py-10 text-center sm:px-6 sm:py-12 md:py-16 md:text-left lg:py-20">
              <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Planora
              </h1>
              <p className="mb-6 font-sans text-base text-blue-100 sm:text-lg md:text-xl">
                Find and join unforgettable events, from concerts to conferences.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 md:justify-start">
                <Link
                  to="/events"
                  className="px-4 py-2 font-sans text-sm font-medium text-gray-700 transition-all duration-300 bg-white rounded-md shadow sm:text-base hover:bg-gray-100 hover:scale-105"
                >
                  Explore
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 font-sans text-sm font-medium text-white transition-all duration-300 bg-transparent border border-white rounded-md sm:text-base hover:bg-white hover:text-gray-700 "
                >
                  Join
                </Link>
              </div>
            </div>
          </div>
        </section>

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
            <div className="p-6 text-center transition-shadow rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Easy Discovery</h3>
              <p className="text-gray-600">
                Find events that match your interests with our intuitive search and filtering system.
              </p>
            </div>

            <div className="p-6 text-center transition-shadow rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Seamless Registration</h3>
              <p className="text-gray-600">
                Register for events with just a few clicks and manage all your bookings in one place.
              </p>
            </div>

            <div className="p-6 text-center transition-shadow rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 hover:shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-full">
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
                        className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
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
      <section className="py-20 text-white bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-xl text-blue-100">
            Join our community today and start discovering amazing events in your area.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 text-lg font-semibold text-blue-600 transition-all duration-300 bg-white rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;