'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ListPet() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    description: '',
    personality: [] as string[],
  })
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const petTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Other']

  const personalityTraits = [
    'Friendly',
    'Energetic',
    'Calm',
    'Independent',
    'Social',
    'Playful',
    'Quiet',
    'Affectionate',
    'Good with kids',
    'Good with other pets',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    
    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age) // Convert to number
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create pet listing')
      }

      alert('Pet listed successfully!')
      router.push('/')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">List a Pet</h1>
        {isClient ? (
          <form key="list-pet-form" onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Pet Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                suppressHydrationWarning
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Pet Type
              </label>
              <select
                id="type"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                suppressHydrationWarning
              >
                <option value="">Select pet type</option>
                {petTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
                Breed (if applicable)
              </label>
              <input
                type="text"
                id="breed"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                suppressHydrationWarning
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age (in years)
              </label>
              <input
                type="number"
                id="age"
                required
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                suppressHydrationWarning
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personality Traits
              </label>
              <div className="grid grid-cols-2 gap-2">
                {personalityTraits.map((trait) => (
                  <label key={trait} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.personality.includes(trait)}
                      onChange={(e) => {
                        const newTraits = e.target.checked
                          ? [...formData.personality, trait]
                          : formData.personality.filter((t) => t !== trait)
                        setFormData({ ...formData, personality: newTraits })
                      }}
                      suppressHydrationWarning
                    />
                    <span className="text-sm text-gray-700">{trait}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'List Pet'}
            </button>
          </form>
        ) : (
          <div className="flex justify-center p-6">
            <div className="animate-pulse">Loading form...</div>
          </div>
        )}
      </div>
    </div>
  )
} 