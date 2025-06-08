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

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'profile'>('events');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/registrations/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setRegistrations(response.data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
    setFormMessage('');
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to change password';
      }
      if (formData.newPassword && formData.newPassword.length < 6) {
        errors.newPassword = 'New password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    return errors;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${user?.id}`,
        {
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      // Optionally update user context here if a setter is available
      setFormMessage('Profile updated successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setFormErrors({});
    } catch (error: any) {
      console.error('Profile update error:', error);
      setFormMessage(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const upcomingEvents = registrations.filter((event) => new Date(event.date) >= new Date());
  const pastEvents = registrations.filter((event) => new Date(event.date) < new Date());

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="p-8 mb-8 text-white bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl">
          <h1 className="mb-2 text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-lg text-blue-100">
            Here's an overview of your registered events and profile.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8">
              <button
                onClick={() => setActiveTab('events')}
                className={`${
                  activeTab === 'events'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Profile
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'events' ? (
          <>
            {/* Stats Cards */}
            <div className="grid gap-6 mb-8 md:grid-cols-3">
              <div className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-3xl font-bold text-gray-900">{registrations.length}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <div className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Upcoming Events</p>
                    <p className="text-3xl font-bold text-green-600">{upcomingEvents.length}</p>
                  </div>
                  <Clock className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Attended Events</p>
                    <p className="text-3xl font-bold text-purple-600">{pastEvents.length}</p>
                  </div>
                  <Star className="w-12 h-12 text-purple-600" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Upcoming Events */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                    <Link
                      to="/events"
                      className="flex items-center font-medium text-blue-600 hover:text-blue-700"
                    >
                      Browse More Events
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  {upcomingEvents.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="overflow-hidden transition-shadow bg-white shadow-md rounded-xl hover:shadow-lg"
                        >
                          <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
                            {event.main_image ? (
                              <img
                                src={`http://localhost:5000${event.main_image}`}
                                alt={event.title}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full">
                                <Calendar className="w-12 h-12 text-white opacity-50" />
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
                                Registered
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">{event.title}</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <Link
                              to={`/events/${event.id}`}
                              className="inline-block mt-4 font-medium text-blue-600 hover:text-blue-700"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-white shadow-md rounded-xl">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">No Upcoming Events</h3>
                      <p className="mb-6 text-gray-600">
                        You haven't registered for any upcoming events yet.
                      </p>
                      <Link
                        to="/events"
                        className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Browse Events
                      </Link>
                    </div>
                  )}
                </div>

                {/* Past Events */}
                {pastEvents.length > 0 && (
                  <div>
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">Event History</h2>
                    <div className="overflow-hidden bg-white shadow-md rounded-xl">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Event
                              </th>
                              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Date
                              </th>
                              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Location
                              </th>
                              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {pastEvents.map((event) => (
                              <tr key={event.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 w-10 h-10">
                                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                                        <Calendar className="w-5 h-5 text-white" />
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
                                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                  {new Date(event.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                  {event.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
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
          </>
        ) : (
          /* Profile Tab */
          <div className="p-10 bg-white border border-gray-100 shadow-lg rounded-2xl">
  <h2 className="mb-8 text-2xl font-semibold text-gray-800">Your Profile</h2>
  <form onSubmit={handleProfileUpdate} className="max-w-3xl space-y-6">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-600">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="block w-full px-4 py-3 mt-2 text-base transition-colors border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Enter your name"
        />
        {formErrors.name && <p className="mt-2 text-sm text-red-500">{formErrors.name}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="block w-full px-4 py-3 mt-2 text-base transition-colors border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Enter your email"
        />
        {formErrors.email && <p className="mt-2 text-sm text-red-500">{formErrors.email}</p>}
      </div>
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600">
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
          className="block w-full px-4 py-3 mt-2 text-base transition-colors border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Enter current password"
        />
        {formErrors.currentPassword && (
          <p className="mt-2 text-sm text-red-500">{formErrors.currentPassword}</p>
        )}
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          className="block w-full px-4 py-3 mt-2 text-base transition-colors border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
          placeholder="Enter new password"
        />
        {formErrors.newPassword && (
          <p className="mt-2 text-sm text-red-500">{formErrors.newPassword}</p>
        )}
      </div>
    </div>
    <div>
      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
        Confirm New Password
      </label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        className="block w-full px-4 py-3 mt-2 text-base transition-colors border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
        placeholder="Confirm new password"
      />
      {formErrors.confirmPassword && (
        <p className="mt-2 text-sm text-red-500">{formErrors.confirmPassword}</p>
      )}
    </div>
    {formMessage && (
      <p
        className={`text-sm font-medium ${
          formMessage.includes('successfully') ? 'text-green-600' : 'text-red-500'
        }`}
      >
        {formMessage}
      </p>
    )}
    <div>
      <button
        type="submit"
        className="w-full px-6 py-3 font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
      >
        Update Profile
      </button>
    </div>
  </form>
</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;