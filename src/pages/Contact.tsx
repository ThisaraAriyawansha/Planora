import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, Users } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/registrations/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: 'thisara.a2001@gmail.com', // Admin email
        }),
      });

      if (response.ok) {
        console.log('Form submitted:', formData);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000); // Auto-close popup after 3 seconds
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold">Get in Touch</h1>
          <p className="text-xl text-blue-100">
            Have questions or need help? We're here to assist you every step of the way.
          </p>
        </div>
      </section>

      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Let's Start a Conversation</h2>
            <p className="mb-8 text-lg text-gray-600">
              Whether you're looking to organize an event, need help with registration, or have feedback about our platform, 
              we'd love to hear from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                  <p className="text-gray-600">support@planora.com</p>
                  <p className="text-sm text-gray-500">We'll get back to you within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                  <p className="text-gray-600">+94 11 234 5678</p>
                  <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Visit Us</h3>
                  <p className="text-gray-600">123 Event Street<br />Colombo, Sri Lanka</p>
                  <p className="text-sm text-gray-500">Open for scheduled meetings</p>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="mt-12">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Quick Help</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">How do I create an event?</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Register as an organizer and use our intuitive event creation tools.
                  </p>
                </div>
                
                <div className="p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">How do I register for events?</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Simply browse events and click "Register Now" on any event page.
                  </p>
                </div>

                <div className="p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Need help with your account?</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Visit your dashboard or contact our support team for assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 bg-white shadow-lg rounded-xl">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">Send us a Message</h3>
            
            {error && (
              <div className="px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="event">Event Organization Help</option>
                  <option value="account">Account Issues</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="partnership">Partnership Opportunities</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className={`flex items-center justify-center w-full px-6 py-3 space-x-2 font-semibold text-white rounded-lg transition-colors ${
                  isSending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>{isSending ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 text-center bg-white rounded-lg shadow-xl">
            <div className="mb-4 text-green-600">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Message Sent!</h3>
            <p className="mb-4 text-gray-600">Thank you for your message. We'll get back to you soon.</p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;