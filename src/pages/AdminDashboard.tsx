import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Calendar, BarChart3, UserCheck, UserX, Eye, User, Lock, Mail, Menu, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  organizer_name: string;
  status: string;
  capacity: number;
}

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, eventsResponse, currentUserResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/api/events/admin'),
          axios.get('http://localhost:5000/api/users/me', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);
        setUsers(usersResponse.data);
        setEvents(eventsResponse.data);
        setCurrentUser(currentUserResponse.data);
        setProfileForm({
          name: currentUserResponse.data.name,
          email: currentUserResponse.data.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateUserStatus = async (userId: number, status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/status`, { status });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const updateEventStatus = async (eventId: number, status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/events/${eventId}/status`, { status });
      setEvents(events.map(event =>
        event.id === eventId ? { ...event, status } : event
      ));
    } catch (error) {
      console.error('Error updating event status:', error);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setProfileError('New passwords do not match');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${currentUser?.id}`,
        {
          name: profileForm.name,
          email: profileForm.email,
          currentPassword: profileForm.currentPassword,
          newPassword: profileForm.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setProfileSuccess('Profile updated successfully');
      setCurrentUser(response.data.user);
      setProfileForm({
        ...profileForm,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      if (currentUser?.role === 'Admin') {
        const [usersResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/users')
        ]);
        setUsers(usersResponse.data);
      }
    } catch (error: any) {
      setProfileError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const stats = {
    totalUsers: users.length,
    totalEvents: events.length,
    activeUsers: users.filter(user => user.status === 'active').length,
    organizers: users.filter(user => user.role === 'Organizer').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b border-gray-200 md:hidden">
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-500 rounded-md hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Mobile sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden">
            <div className="flex flex-col w-5/6 h-full max-w-sm bg-white">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Overview
                </button>
                <button
                  onClick={() => {
                    setActiveTab('users');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'users' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-5 h-5 mr-3" />
                  User Management
                </button>
                <button
                  onClick={() => {
                    setActiveTab('events');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'events' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Event Management
                </button>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  My Profile
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden w-64 p-4 bg-white border-r border-gray-200 md:block">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Admin Dashboard</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'users' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              User Management
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'events' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5 mr-3" />
              Event Management
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5 mr-3" />
              My Profile
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-8">
          {/* Header - Desktop */}
          <div className="hidden p-8 mb-8 text-white bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl md:block">
            <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-lg text-blue-100">
              Manage users, events, and platform settings from here.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-10 h-10 text-blue-600 sm:w-12 sm:h-12" />
              </div>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
                </div>
                <UserCheck className="w-10 h-10 text-green-600 sm:w-12 sm:h-12" />
              </div>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalEvents}</p>
                </div>
                <Calendar className="w-10 h-10 text-purple-600 sm:w-12 sm:h-12" />
              </div>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Organizers</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.organizers}</p>
                </div>
                <BarChart3 className="w-10 h-10 text-orange-600 sm:w-12 sm:h-12" />
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="bg-white shadow-md rounded-xl">
            {activeTab === 'overview' && (
              <div className="p-4 space-y-6 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900">Platform Overview</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 font-medium text-gray-900">Recent User Registrations</h4>
                    <div className="space-y-2">
                      {users.slice(0, 5).map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-3 font-medium text-gray-900">Recent Events</h4>
                    <div className="space-y-2">
                      {events.slice(0, 5).map(event => (
                        <div key={event.id} className="p-3 rounded-lg bg-gray-50">
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.location} • {new Date(event.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="p-4 md:p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:px-6">
                          User
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:px-6">
                          Role
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:px-6">
                          Status
                        </th>
                        <th scope="col" className="hidden px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:px-6 md:table-cell">
                          Joined
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:px-6">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'Organizer' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="hidden px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6 md:table-cell">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap sm:px-6">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                                className={`p-1 rounded ${
                                  user.status === 'active' 
                                    ? 'text-red-600 hover:bg-red-100' 
                                    : 'text-green-600 hover:bg-green-100'
                                }`}
                                title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                              >
                                {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="p-4 md:p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Event Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:px-6">
                          Event
                        </th>
                        <th scope="col" className="hidden px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:px-6 md:table-cell">
                          Organizer
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:px-6">
                          Date
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:px-6">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase sm:px-6">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map(event => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 sm:px-6">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{event.title}</div>
                              <div className="text-sm text-gray-500">{event.location}</div>
                            </div>
                          </td>
                          <td className="hidden px-4 py-4 text-sm text-gray-900 whitespace-nowrap sm:px-6 md:table-cell">
                            {event.organizer_name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6">
                            {new Date(event.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap sm:px-6">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateEventStatus(event.id, event.status === 'active' ? 'inactive' : 'active')}
                                className={`p-1 rounded ${
                                  event.status === 'active'
                                    ? 'text-red-600 hover:bg-red-100'
                                    : 'text-green-600 hover:bg-green-100'
                                }`}
                                title={event.status === 'active' ? 'Deactivate' : 'Activate'}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'profile' && currentUser && (
              <div className="max-w-2xl p-4 mx-auto md:p-6">
                {/* Profile Header with Avatar */}
                

                {/* Status Messages */}
                {profileError && (
                  <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{profileError}</span>
                    </div>
                  </div>
                )}
                
                {profileSuccess && (
                  <div className="p-4 mb-6 text-green-700 bg-green-100 border-l-4 border-green-500 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{profileSuccess}</span>
                    </div>
                  </div>
                )}

                {/* Modern Form Design */}
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="space-y-6">
                    {/* Personal Information Section */}
                    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                      <h4 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Personal Information
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={profileForm.name}
                              onChange={handleProfileChange}
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Your name"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={profileForm.email}
                              onChange={handleProfileChange}
                              className="block w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                      <h4 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                        <Lock className="w-5 h-5 mr-2 text-blue-600" />
                        Password Settings
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block mb-1 text-sm font-medium text-gray-700">
                            Current Password
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              name="currentPassword"
                              id="currentPassword"
                              value={profileForm.currentPassword}
                              onChange={handleProfileChange}
                              className="block w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Current password"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="newPassword" className="block mb-1 text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              name="newPassword"
                              id="newPassword"
                              value={profileForm.newPassword}
                              onChange={handleProfileChange}
                              className="block w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="New password"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">Minimum 8 characters with at least one number</p>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              name="confirmPassword"
                              id="confirmPassword"
                              value={profileForm.confirmPassword}
                              onChange={handleProfileChange}
                              className="block w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;