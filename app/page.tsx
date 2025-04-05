'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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

export default function Home() {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pets');
        
        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }
        
        const data = await response.json();
        // Get random 3 pets or all if less than 3
        const petsToShow = data.pets || [];
        if (petsToShow.length > 3) {
          // Shuffle array and take first 3
          const shuffled = [...petsToShow].sort(() => 0.5 - Math.random());
          setFeaturedPets(shuffled.slice(0, 3));
        } else {
          setFeaturedPets(petsToShow);
        }
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError('Failed to load pets');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Find Your Perfect Pet Companion
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Our AI-powered matching technology helps you discover the ideal pet that fits your lifestyle and preferences.
              </p>
              <Link href="/find-pet" className="inline-flex items-center px-8 py-6 bg-white text-blue-700 hover:bg-blue-50 text-lg rounded-lg font-semibold">
                Find Your Match
              </Link>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-96 w-full md:px-8">
              <div className="absolute inset-0 bg-white rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1200&auto=format&fit=crop"
                  alt="Happy pets"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Share Your Preferences</h3>
              <p className="text-black">
                Tell us about your lifestyle, experience with pets, and what you're looking for in a companion.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">AI-Powered Matching</h3>
              <p className="text-black">
                Our advanced algorithm analyzes your information to find pets that would thrive in your home.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Meet Your Match</h3>
              <p className="text-black">
                Review your personalized matches and take the first step toward meeting your new best friend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Pets</h2>
          <p className="text-center text-gray-600 mb-12">Meet some of our wonderful animals waiting for their forever homes</p>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 mb-8">
              {error}
              <p className="mt-2">
                <Link href="/debug" className="text-blue-600 hover:text-blue-800">
                  Check system status
                </Link>
              </p>
            </div>
          ) : featuredPets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No pets available at the moment.</p>
              <Link href="/admin/add-pet" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Add Your First Pet
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/find-pet" className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Find Your Perfect Match
              </Link>
              <Link href="/browse" className="inline-flex items-center justify-center px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md">
                Browse All Pets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">Happy Matches</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h3 className="font-semibold text-black">Sarah Johnson</h3>
                  <p className="text-gray-600 text-sm">Matched with Max, Golden Retriever</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The matching process was incredible! Max fits perfectly into our active family life. It's like he was made for us!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h3 className="font-semibold text-black">Michael Roberts</h3>
                  <p className="text-gray-600 text-sm">Matched with Luna, Siamese Cat</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "As someone living alone in an apartment, Luna has been the perfect companion. She's independent but affectionate exactly when I need it."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Ready to Meet Your Perfect Pet?</h2>
          <p className="text-xl mb-8">
            Take our quick matching quiz and discover the companion that's right for you.
          </p>
          <Link href="/find-pet" className="inline-flex items-center px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 text-lg rounded-lg font-semibold">
            Start Matching Now
          </Link>
        </div>
      </section>
    </main>
  )
}

function PetCard({ pet }: { pet: Pet }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-64">
        {pet.imageUrl ? (
          <Image
            src={pet.imageUrl}
            alt={`${pet.name} the ${pet.breed || pet.type}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold">{pet.name}</h3>
        <p className="text-gray-600">{pet.type} • {pet.breed || 'Mixed'} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old</p>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {pet.personality.slice(0, 3).map((trait) => (
            <span 
              key={trait} 
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {trait}
            </span>
          ))}
          {pet.personality.length > 3 && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
              +{pet.personality.length - 3} more
            </span>
          )}
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Link 
            href={`/browse?type=${pet.type}`} 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Find similar pets
          </Link>
          <span className="text-gray-300">|</span>
          <Link 
            href={`/admin/pets`} 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all pets
          </Link>
        </div>
      </div>
    </div>
  )
}
