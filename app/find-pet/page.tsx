'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function FindPet() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferences: [] as string[],
    lifestyle: '',
    experience: '',
    additionalInfo: '',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const lifestyleOptions = [
    'Very Active',
    'Active',
    'Moderate',
    'Relaxed',
    'Sedentary',
  ]

  const experienceOptions = [
    'First-time owner',
    'Some experience',
    'Experienced',
    'Professional',
  ]

  const preferenceOptions = [
    'Dogs',
    'Cats',
    'Small animals',
    'Good with children',
    'Low maintenance',
    'High energy',
    'Quiet',
    'Outdoor-loving',
    'Indoor-only',
  ]

  const validateStep = (currentStep: number): boolean => {
    setError(null);
    
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setError('Please enter your name');
        return false;
      }
      
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      return true;
    }
    
    if (currentStep === 2) {
      if (formData.preferences.length === 0) {
        setError('Please select at least one pet preference');
        return false;
      }
      
      // Make sure at least one animal type is selected
      const hasAnimalType = formData.preferences.some(pref => 
        ['Dogs', 'Cats', 'Small animals'].includes(pref)
      );
      
      if (!hasAnimalType) {
        setError('Please select at least one animal type (Dogs, Cats, or Small animals)');
        return false;
      }
      
      return true;
    }
    
    if (currentStep === 3) {
      if (!formData.lifestyle) {
        setError('Please select your lifestyle');
        return false;
      }
      
      if (!formData.experience) {
        setError('Please select your experience level');
        return false;
      }
      
      return true;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!formData.lifestyle) {
      setError('Please select your lifestyle');
      return;
    }
    
    if (!formData.experience) {
      setError('Please select your experience level');
      return;
    }
    
    if (formData.preferences.length === 0) {
      setError('Please select at least one pet preference');
      return;
    }
    
    // Make sure at least one animal type is selected
    const hasAnimalType = formData.preferences.some(pref => 
      ['Dogs', 'Cats', 'Small animals'].includes(pref)
    );
    
    if (!hasAnimalType) {
      setError('Please select at least one animal type (Dogs, Cats, or Small animals)');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Submitting form data:', formData);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('User creation error:', errorData);
        throw new Error(errorData.message || 'Failed to create profile');
      }

      const data = await response.json();
      console.log('User created:', data.userId);
      
      // Now request matches for this user
      try {
        console.log('Requesting matches for user:', data.userId);
        const matchResponse = await fetch('/api/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: data.userId }),
        });
        
        // Clone the response before trying to parse it
        const matchResponseClone = matchResponse.clone();
        
        if (!matchResponse.ok) {
          let errorMessage = 'Failed to generate matches';
          let errorDetails = {};
          
          try {
            // Try to parse the error response as JSON
            const errorData = await matchResponseClone.json();
            console.log('Error response received:', errorData);
            
            // Handle both error formats
            errorDetails = typeof errorData === 'object' ? errorData : {};
            errorMessage = errorData.error || errorMessage;
            
            // Log the detailed error
            console.error('Match generation error details:', errorDetails);
          } catch (parseError) {
            // If JSON parsing fails, try to get the text content
            try {
              const errorText = await matchResponseClone.text();
              console.error('Failed to parse JSON error, raw response:', errorText);
            } catch (textError) {
              console.error('Failed to get error text:', textError);
            }
          }
          console.error('Match generation error:', errorMessage);
          console.log('Continuing to matches page despite error...');
        } else {
          try {
            const matchData = await matchResponse.json();
            console.log('Matches generated successfully:', matchData);
            
            if (matchData.warning) {
              console.warn('Match warning:', matchData.warning);
            }
          } catch (parseError) {
            console.error('Failed to parse success response:', parseError);
          }
        }
      } catch (matchError) {
        console.error('Match generation error:', matchError);
        console.log('Continuing to matches page despite error...');
      }
      
      // Regardless of match generation success, redirect to matches page
      router.push(`/matches/${data.userId}`);
    } catch (error) {
      console.error('Submission error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black">Tell Us About Yourself</h2>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-black"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                suppressHydrationWarning
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-black"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                suppressHydrationWarning
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black">What Type of Pet Are You Looking For?</h2>
            
            <div>
              <label className="block text-sm font-medium text-black mb-3">
                Pet Preferences (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {preferenceOptions.map((pref) => (
                  <div key={pref} className="relative">
                    <label 
                      className={`flex items-center p-3 rounded-lg border ${
                        formData.preferences.includes(pref) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      } cursor-pointer transition-colors`}
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        checked={formData.preferences.includes(pref)}
                        onChange={(e) => {
                          const newPreferences = e.target.checked
                            ? [...formData.preferences, pref]
                            : formData.preferences.filter((p) => p !== pref)
                          setFormData({ ...formData, preferences: newPreferences })
                        }}
                        suppressHydrationWarning
                      />
                      <span className="text-sm font-medium text-black">{pref}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black">Your Lifestyle & Experience</h2>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Your Lifestyle
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-black"
                value={formData.lifestyle}
                onChange={(e) => setFormData({ ...formData, lifestyle: e.target.value })}
                suppressHydrationWarning
              >
                <option value="" className="text-black">Select your lifestyle</option>
                {lifestyleOptions.map((option) => (
                  <option key={option} value={option} className="text-black">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Pet Experience
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-black"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                suppressHydrationWarning
              >
                <option value="" className="text-black">Select your experience level</option>
                {experienceOptions.map((option) => (
                  <option key={option} value={option} className="text-black">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-black">
                Additional Information (Optional)
              </label>
              <textarea
                id="additionalInfo"
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-black"
                placeholder="Tell us anything else that might help us find your perfect pet match..."
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                suppressHydrationWarning
              ></textarea>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Finding Matches...' : 'Find My Perfect Pet'}
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="relative">
            <div className="h-48 sm:h-64 w-full bg-gradient-to-r from-blue-600 to-indigo-700 relative">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-3xl font-bold">Find Your Perfect Pet</h1>
                <p className="mt-2">Tell us about yourself and we'll match you with compatible companions</p>
              </div>
            </div>
            
            <div className="absolute -bottom-5 right-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full p-1 shadow-lg">
                <div className="w-full h-full rounded-full relative overflow-hidden">
                  <Image 
                    src="https://cdn-icons-png.flaticon.com/512/1076/1076877.png" 
                    alt="Pet paw"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 sm:px-6 py-8">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[1, 2, 3].map((stepNumber) => (
                  <div 
                    key={stepNumber}
                    className={`w-full h-1 rounded-full mx-1 ${
                      stepNumber <= step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-black">
                <span>Your Info</span>
                <span>Pet Type</span>
                <span>Lifestyle & Experience</span>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {isClient ? (
              <form onSubmit={handleSubmit}>
                {renderStepContent()}
              </form>
            ) : (
              <div className="flex justify-center p-6">
                <div className="animate-pulse">Loading form...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 