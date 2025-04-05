'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FormData {
  name: string;
  type: string;
  breed: string;
  age: string;
  description: string;
  imageUrl: string;
  personality: string[];
}

export default function AddPet() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: '',
    breed: '',
    age: '',
    description: '',
    imageUrl: '',
    personality: []
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personalityInput, setPersonalityInput] = useState('');

  const petTypes = ['Dog', 'Cat', 'Rabbit', 'Hamster', 'Bird', 'Other'];
  
  const personalityOptions = [
    'Friendly', 'Energetic', 'Calm', 'Loyal', 'Playful',
    'Intelligent', 'Independent', 'Affectionate', 'Quiet',
    'Social', 'Protective', 'Curious', 'Gentle', 'Active'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalityChange = (trait: string) => {
    setFormData(prev => {
      const newPersonality = prev.personality.includes(trait)
        ? prev.personality.filter(p => p !== trait)
        : [...prev.personality, trait];
      return { ...prev, personality: newPersonality };
    });
  };

  const addCustomPersonality = () => {
    if (personalityInput.trim() && !formData.personality.includes(personalityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        personality: [...prev.personality, personalityInput.trim()]
      }));
      setPersonalityInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      setError('Pet name is required');
      return;
    }
    
    if (!formData.type) {
      setError('Pet type is required');
      return;
    }
    
    if (!formData.age || isNaN(Number(formData.age))) {
      setError('Valid age is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (formData.personality.length === 0) {
      setError('At least one personality trait is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add pet');
      }
      
      setSuccess(true);
      
      // Clear form after successful submission
      setFormData({
        name: '',
        type: '',
        breed: '',
        age: '',
        description: '',
        imageUrl: '',
        personality: []
      });
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Add New Pet</h1>
            <button
              onClick={() => router.push('/admin/pets')}
              className="text-blue-600 hover:text-blue-800"
            >
              View All Pets
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
              Pet added successfully!
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Pet Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Pet Type*
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select pet type</option>
                  {petTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
                  Breed
                </label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age (in years)*
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="0"
                  step="0.5"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/pet-image.jpg"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave empty to use a default image based on pet type
              </p>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personality Traits*
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {personalityOptions.map(trait => (
                  <button
                    key={trait}
                    type="button"
                    onClick={() => handlePersonalityChange(trait)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                      ${formData.personality.includes(trait) 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={personalityInput}
                  onChange={(e) => setPersonalityInput(e.target.value)}
                  placeholder="Add custom trait..."
                  className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addCustomPersonality}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              
              {formData.personality.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-700 mb-1">Selected traits:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.personality.map(trait => (
                      <span
                        key={trait}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {trait}
                        <button
                          type="button"
                          onClick={() => handlePersonalityChange(trait)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Adding...' : 'Add Pet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 