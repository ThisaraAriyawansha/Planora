// src/components/PredictCategory.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PredictCategory: React.FC = () => {
  const [formData, setFormData] = useState({
    age: 18,
    gender: 'Male',
    tech_spend: 1,
    music_freq: 1,
    sports_hours: 1,
    business_interest: 1,
    edu_freq: 1,
    food_interest: 1,
    health_priority: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    setProgress(0);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 10;
        clearInterval(progressInterval);
        return 100;
      });
    }, 150);

    try {
      const predictionResponse = await axios.post('http://localhost:5001/predict', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Prediction Response:', predictionResponse.data);
      const predictedCategory = predictionResponse.data.prediction;

      // Update user preference in Express backend
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      await axios.patch(
        'http://localhost:5000/api/auth/update-preference',
        { email, preference: predictedCategory },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(`Your favorite category is: ${predictedCategory}`);
      setTimeout(() => navigate('/'), 4000);
    } catch (err: any) {
      console.error('Error:', err);
      if (err.message === 'Network Error') {
        setError('Unable to connect to the server. Please check if the server is running.');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update preference');
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Age</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="age"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 px-2 py-1 text-center rounded-md bg-blue-50">{formData.age}</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Hobbies & Interests</h3>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Tech Spending (1=Never, 5=Very Often)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="tech_spend"
                  min="1"
                  max="5"
                  value={formData.tech_spend}
                  onChange={handleChange}
                  required
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 px-2 py-1 text-center rounded-md bg-blue-50">{formData.tech_spend}</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Music Frequency (1=Rarely, 5=Daily)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="music_freq"
                  min="1"
                  max="5"
                  value={formData.music_freq}
                  onChange={handleChange}
                  required
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 px-2 py-1 text-center rounded-md bg-blue-50">{formData.music_freq}</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Sports Hours (1=None, 5=10+ hours)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="sports_hours"
                  min="1"
                  max="5"
                  value={formData.sports_hours}
                  onChange={handleChange}
                  required
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 px-2 py-1 text-center rounded-md bg-blue-50">{formData.sports_hours}</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Preferences</h3>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Business Interest (1=Not at all, 5=Very Interested)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="business_interest"
                  min="1"
                  max="5"
                  value={formData.business_interest}
                  onChange={handleChange}
                  required
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 px-2 py-1 text-center rounded-md bg-blue-50">{formData.business_interest}</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Education Frequency (1=Never, 5=Regularly)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="edu_freq"
                  min="1"
                  max="5"
                  value={formData.edu_freq}
                  onChange={handleChange}
                  required
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 px-2 py-1 text-center rounded-md bg-blue-50">{formData.edu_freq}</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Food Interest (1=No interest, 5=Love it)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="food_interest"
                  min="1"
                  max="5"
                  value={formData.food_interest}
                  onChange={handleChange}
                  required
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 px-2 py-1 text-center rounded-md bg-blue-50">{formData.food_interest}</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Health Priority (1=Low, 5=Top priority)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="health_priority"
                  min="1"
                  max="5"
                  value={formData.health_priority}
                  onChange={handleChange}
                  required
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 px-2 py-1 text-center rounded-md bg-blue-50">{formData.health_priority}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 mt-6 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Predicting...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-xl">
        {/* Top Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 transition-all duration-500 ease-in-out bg-blue-600 rounded-full"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800">Tell Us About Yourself</h2>
        <p className="mt-2 text-center text-gray-600">Help us find events you'll love</p>

        {error && (
          <div className="px-4 py-3 mt-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-8">
          {renderStep()}
        </div>

        {currentStep < 3 && (
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                currentStep === 1 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        )}

        {result && (
            <div className="flex items-center max-w-xl px-6 py-4 mx-auto mt-6 space-x-3 text-green-800 bg-white border border-green-300 shadow-md rounded-xl animate-fade-in">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{result}</span>
            </div>


        )}

        {loading && (
          <div className="mt-6">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-center text-gray-600">Analyzing your preferences...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictCategory;