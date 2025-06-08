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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
        
        // Check if user is already registered
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
      
      // Update event data to reflect new registration count
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <button
            onClick={() => navigate('/events')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isEventFull = event.registrations_count >= event.capacity;
  const spotsLeft = event.capacity - event.registrations_count;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Events
        </button>

        {/* Event Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-500 to-purple-600">
            {event.main_image ? (
              <img
                src={`http://localhost:5000${event.main_image}`}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="h-24 w-24 text-white opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute bottom-6 left-6 text-white">
              {event.category && (
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-2 inline-block">
                  {event.category}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Event Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">{new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <p>{event.location}</p>
                </div>

                <div className="flex items-center text-gray-700">
                  <Users className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">{event.registrations_count} / {event.capacity} registered</p>
                    <p className="text-sm text-gray-500">
                      {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Event is full'}
                    </p>
                  </div>
                </div>

                {event.organizer_name && (
                  <div className="flex items-center text-gray-700">
                    <User className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Organized by</p>
                      <p className="text-sm text-gray-500">{event.organizer_name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center">
                {registered ? (
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-900 mb-2">You're Registered!</p>
                    <p className="text-gray-600">We'll see you at the event</p>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering || isEventFull || !user}
                    className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                      isEventFull
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : !user
                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
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
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>
            </div>

            {/* Additional Images */}
            {event.images && event.images.length > 0 && (
              <div className="border-t pt-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`Event image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;