'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  age: number;
  description: string;
  imageUrl?: string;
  personality: string[];
}

export default function ManagePets() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pets');
        
        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }
        
        const data = await response.json();
        setPets(data.pets || []);
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching pets');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchPets();
  }, []);

  const handleAddPet = () => {
    router.push('/admin/add-pet');
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/debug?reload=true');
      if (!response.ok) {
        throw new Error('Failed to reload sample data');
      }
      
      // Fetch pets again after reloading
      const petsResponse = await fetch('/api/pets');
      if (!petsResponse.ok) {
        throw new Error('Failed to fetch pets after reload');
      }
      
      const data = await petsResponse.json();
      setPets(data.pets || []);
      
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while refreshing data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pet Listings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage pets available for matching
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refresh Data
              </button>
              <button
                onClick={handleAddPet}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add New Pet
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mx-4 my-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {loading && !initialized ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : pets.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 mb-4">No pets found in the system.</p>
              <button
                onClick={handleAddPet}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Your First Pet
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {pets.map(pet => (
                  <li key={pet.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-16 w-16 relative rounded-full overflow-hidden">
                        {pet.imageUrl ? (
                          <Image
                            src={pet.imageUrl}
                            alt={pet.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-gray-900 truncate">
                          {pet.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {pet.type} {pet.breed ? `• ${pet.breed}` : ''} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {pet.personality.slice(0, 3).map(trait => (
                            <span 
                              key={trait} 
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {trait}
                            </span>
                          ))}
                          {pet.personality.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{pet.personality.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ID: {pet.id.substring(0, 6)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 