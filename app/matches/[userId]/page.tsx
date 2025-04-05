'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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

interface Match {
  id: string;
  score: number;
  pet: Pet;
  status: string;
}

export default function Matches() {
  const params = useParams()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    const fetchMatches = async () => {
      try {
        if (!params.userId) {
          setError('User ID is missing')
          setLoading(false)
          return
        }
        
        console.log('Fetching matches for user:', params.userId)
        const response = await fetch(`/api/match?userId=${params.userId}`, {
          method: 'GET',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Match fetch error:', errorData)
          throw new Error('Failed to fetch matches')
        }

        const data = await response.json()
        console.log('Matches API response:', data)
        console.log('Matches loaded:', data.matches?.length || 0)
        
        if (data.matches && Array.isArray(data.matches)) {
          setMatches(data.matches)
        } else {
          console.error('Invalid matches data format:', data)
          setError('Invalid match data received from server')
        }
      } catch (error) {
        console.error('Error fetching matches:', error)
        setError('Failed to load matches. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (isClient) {
      fetchMatches()
    }
  }, [params.userId, isClient])

  // Debug logging
  useEffect(() => {
    if (isClient) {
      console.log('Current matches state:', matches)
    }
  }, [matches, isClient])

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Initializing...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-2xl text-gray-600">Finding your perfect pet matches...</div>
        <p className="text-gray-500 mt-2">This might take a moment as we analyze compatibility.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Your Pet Matches</h1>
        <div className="space-y-8">
          {!matches || matches.length === 0 ? (
            <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow">
              <p className="mb-4">No matches found. Try adjusting your preferences.</p>
              <div className="space-y-4">
                <button 
                  onClick={() => window.location.href = '/find-pet'}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Update Preferences
                </button>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">If you're seeing this unexpectedly, there might be an issue with the pet data.</p>
                  <div className="flex space-x-3 justify-center">
                    <a 
                      href="/debug" 
                      className="text-sm text-blue-600 hover:text-blue-800 inline-block"
                    >
                      Go to Debug Page
                    </a>
                    <a 
                      href="/admin/add-pet" 
                      className="text-sm text-green-600 hover:text-green-800 inline-block"
                    >
                      Add New Pets
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="md:flex">
                  {/* Pet Image Section */}
                  <div className="md:w-1/3 relative">
                    {match.pet && match.pet.imageUrl ? (
                      <div className="relative h-64 md:h-full">
                        <Image
                          src={match.pet.imageUrl}
                          alt={match.pet.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-200 h-64 md:h-full flex items-center justify-center">
                        <span className="text-gray-400 text-lg">No image available</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {Math.round((match.score || 0.5) * 100)}% Match
                    </div>
                  </div>
                  
                  {/* Pet Details Section */}
                  <div className="p-6 md:w-2/3">
                    {match.pet ? (
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                              {match.pet.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                              {match.pet.type} • {match.pet.breed || 'Mixed'} • {match.pet.age} {match.pet.age === 1 ? 'year' : 'years'} old
                            </p>
                          </div>
                        </div>
                        
                        <p className="mt-4 text-gray-600">{match.pet.description}</p>
                        
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Personality Traits</h3>
                          <div className="flex flex-wrap gap-2">
                            {match.pet.personality.map((trait) => (
                              <span
                                key={trait}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                suppressHydrationWarning
                              >
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-red-500">Pet details not available</p>
                    )}
                    
                    <div className="mt-6">
                      <button
                        onClick={() => alert(`Contact about ${match.pet?.name || 'this pet'} coming soon!`)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Contact About This Pet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {matches && matches.length > 0 && (
          <div className="mt-12 text-center p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Not finding your perfect match?</h3>
            <p className="text-blue-700 mb-4">You can always try again with different preferences to find more compatible pets.</p>
            <button 
              onClick={() => window.location.href = '/find-pet'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Try Different Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 