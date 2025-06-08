import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Registration {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  main_image: string;
  category: string;
  registered_at: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/registrations/user');
        setRegistrations(response.data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const upcomingEvents = registrations.filter(event => new Date(event.date) >= new Date());
  const pastEvents = registrations.filter(event => new Date(event.date) < new Date());

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl text-white p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-blue-100 text-lg">
            Here's an overview of your registered events and activities.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{registrations.length}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming Events</p>
                <p className="text-3xl font-bold text-green-600">{upcomingEvents.length}</p>
              </div>
              <Clock className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Attended Events</p>
                <p className="text-3xl font-bold text-purple-600">{pastEvents.length}</p>
              </div>
              <Star className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                <Link
                  to="/events"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  Browse More Events
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {upcomingEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
                        {event.main_image ? (
                          <img
                            src={`http://localhost:5000${event.main_image}`}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="h-12 w-12 text-white opacity-50" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Registered
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <Link
                          to={`/events/${event.id}`}
                          className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't registered for any upcoming events yet.
                  </p>
                  <Link
                    to="/events"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Browse Events
                  </Link>
                </div>
              )}
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Event History</h2>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {pastEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-white" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                  {event.category && (
                                    <div className="text-sm text-gray-500">{event.category}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(event.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {event.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                Attended
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;