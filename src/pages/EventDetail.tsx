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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Event Not Found</h2>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isEventFull = event.registrations_count >= event.capacity;
  const spotsLeft = event.capacity - event.registrations_count;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px]">
        {event.main_image ? (
          <img
            src={`http://localhost:5000${event.main_image}`}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-600 to-purple-600">
            <Calendar className="w-32 h-32 text-white opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center mb-4 text-white transition-colors hover:text-gray-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Events
            </button>
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">{event.title}</h1>
            {event.category && (
              <span className="inline-block px-4 py-1 mt-4 text-sm font-medium text-white rounded-full bg-white/20 backdrop-blur-sm">
                {event.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
  <div className="overflow-hidden bg-white shadow-2xl rounded-2xl">
    <div className="p-6 sm:p-8">
      {/* Event Info */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start">
            <Clock className="flex-shrink-0 w-6 h-6 mt-1 mr-4 text-blue-600" />
            <div>
              <p className="text-base font-semibold text-gray-900">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-xs text-gray-600">{event.time}</p>
            </div>
          </div>

          <div className="flex items-start">
            <MapPin className="flex-shrink-0 w-6 h-6 mt-1 mr-4 text-blue-600" />
            <p className="text-base text-gray-900">{event.location}</p>
          </div>

          <div className="flex items-start">
            <Users className="flex-shrink-0 w-6 h-6 mt-1 mr-4 text-blue-600" />
            <div>
              <p className="text-base font-semibold text-gray-900">
                {event.registrations_count} / {event.capacity} registered
              </p>
              <p className="text-xs text-gray-600">
                {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Event is full'}
              </p>
            </div>
          </div>

          {event.organizer_name && (
            <div className="flex items-start">
              <User className="flex-shrink-0 w-6 h-6 mt-1 mr-4 text-blue-600" />
              <div>
                <p className="text-base font-semibold text-gray-900">Organized by</p>
                <p className="text-xs text-gray-600">{event.organizer_name}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          {registered ? (
            <div className="text-center animate-fade-in">
              <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-600" />
              <p className="mb-2 text-xl font-semibold text-gray-900">You're Registered!</p>
              <p className="text-sm text-gray-600">We'll see you at the event</p>
            </div>
          ) : (
            <button
              onClick={handleRegister}
              disabled={registering || isEventFull || !user}
              className={`px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
                isEventFull
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : !user
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
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
      <div className="pt-8 mt-8 border-t border-gray-200">
        <h2 className="mb-6 text-xl font-bold text-gray-900">About This Event</h2>
        <p className="text-base leading-relaxed text-gray-700">{event.description}</p>
      </div>
    </div>
  </div>
</div>

      {/* Event Gallery */}
      {event.images && event.images.length > 0 && (
        <div className="w-full py-16 bg-gray-100">
          <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl text-center text-gray-900">Event Gallery</h2>
            <div className="flex flex-col items-center">
              {/* Main Image */}
              <div className="w-full max-w-5xl mx-auto mb-6">
                <div className="relative overflow-hidden bg-white shadow-lg rounded-xl">
                  <img
                    src={`http://localhost:5000${event.images[currentImageIndex]}`}
                    alt={`Event image ${currentImageIndex + 1}`}
                    className="object-cover w-full h-[40vh] sm:h-[50vh] md:h-[60vh]"
                  />
                  <div className="absolute px-3 py-1 text-sm font-medium text-white bg-black rounded-full bottom-4 right-4 bg-opacity-60">
                    {currentImageIndex + 1} / {event.images.length}
                  </div>
                </div>
              </div>
              {/* Thumbnail Boxes */}
              <div className="w-full max-w-5xl mx-auto overflow-x-auto">
                <div className="flex py-4 space-x-4">
                  {event.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        currentImageIndex === index ? 'border-blue-600 shadow-md' : 'border-gray-200 hover:border-blue-400'
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
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EventDetail;