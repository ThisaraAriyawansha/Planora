import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, Clock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-gray-900 animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="mb-6 text-4xl font-semibold text-gray-900">Event Not Found</h2>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-all duration-300 bg-gray-900 rounded-full hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isEventFull = event.registrations_count >= event.capacity;
  const spotsLeft = event.capacity - event.registrations_count;

  return (
    <div className="min-h-screen font-sans bg-gray-100">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] min-h-[500px]">
        {event.main_image ? (
          <img
            src={`http://localhost:5000${event.main_image}`}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-900 to-gray-700">
            <Calendar className="w-24 h-24 text-white opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 px-6 py-12 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center mb-6 text-gray-200 transition-colors duration-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Events
            </button>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">{event.title}</h1>
            {event.category && (
              <span className="inline-block px-4 py-1 mt-4 text-sm font-medium text-white rounded-full bg-white/10 backdrop-blur-sm">
                {event.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl px-4 py-16 mx-auto px livelli 10px-12 sm:px-6 lg:px-8">
        <div className="p-8 bg-white shadow-lg rounded-3xl">
          {/* Event Info */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-8">
              <div className="flex items-start">
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
              </div>

              <div className="flex items-start">
                <MapPin className="w-6 h-6 mt-1 mr-4 text-gray-900" />
                <p className="text-lg text-gray-900">{event.location}</p>
              </div>

              <div className="flex items-start">
                <Users className="w-6 h-6 mt-1 mr-4 text-gray-900" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {event.registrations_count} / {event.capacity} registered
                  </p>
                  <p className="text-sm text-gray-500">
                    {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Event is full'}
                  </p>
                </div>
              </div>

              {event.organizer_name && (
                <div className="flex items-start">
                  <User className="w-6 h-6 mt-1 mr-4 text-gray-900" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Organized by</p>
                    <p className="text-sm text-gray-500">{event.organizer_name}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center">
              {registered ? (
                <div className="text-center animate-fade-in">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <p className="mb-2 text-xl font-semibold text-gray-900">You're Registered!</p>
                  <p className="text-sm text-gray-500">We'll see you at the event</p>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering || isEventFull || !user}
                  className={`px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200 ${
                    isEventFull
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : !user
                      ? 'bg-gray-900 hover:bg-gray-800 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {registering ? (
                    'Registering...'
                  ) : isEventFull ? (
                    'Event Full'
                  ) : !user ? (
                    'Login to Register'
                  ) : (
                    'Register Now'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Event Description */}
          <div className="pt-10 mt-10 border-t border-gray-200">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">About This Event</h2>
            <p className="text-lg leading-relaxed text-gray-700">{event.description}</p>
          </div>
        </div>
      </div>

      {/* Event Gallery */}
      {event.images && event.images.length > 0 && (
        <div className="w-full py-20 bg-white">
          <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
            <h2 className="mb-10 text-3xl font-semibold text-center text-gray-900">Event Gallery</h2>
            <div className="flex flex-col items-center">
              {/* Main Image */}
              <div className="w-full max-w-5xl mx-auto mb-8">
                <div className="relative overflow-hidden bg-white shadow-lg rounded-3xl">
                  <img
                    src={`http://localhost:5000${event.images[currentImageIndex]}`}
                    alt={`Event image ${currentImageIndex + 1}`}
                    className="object-cover w-full h-[50vh] sm:h-[60vh] md:h-[70vh]"
                  />
                  <div className="absolute px-3 py-1 text-sm font-medium text-white bg-gray-900 rounded-full bottom-4 right-4 bg-opacity-70">
                    {currentImageIndex + 1} / {event.images.length}
                  </div>
                </div>
              </div>
              {/* Thumbnails */}
              <div className="w-full max-w-5xl mx-auto overflow-x-auto">
                <div className="flex py-4 space-x-4">
                  {event.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index ? 'border-gray-900 shadow-md' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animation Styles */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default EventDetail;