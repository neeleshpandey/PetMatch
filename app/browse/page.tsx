'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

export default function BrowsePets() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [petTypes, setPetTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || '');
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 20]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pets');
        
        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }
        
        const data = await response.json();
        const petsData = data.pets || [];
        setPets(petsData);
        setFilteredPets(petsData);
        
        // Extract unique pet types
        const types = [...new Set(petsData.map((pet: Pet) => pet.type))];
        setPetTypes(types as string[]);
        
        // Set initial filter from URL if present
        const typeParam = searchParams.get('type');
        if (typeParam) {
          setSelectedType(typeParam);
          applyFilters(petsData, typeParam, [0, 20], '');
        }
        
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError('Failed to load pets');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [searchParams]);

  const applyFilters = (
    petsToFilter: Pet[], 
    type: string, 
    age: [number, number], 
    query: string
  ) => {
    let filtered = [...petsToFilter];
    
    // Filter by type
    if (type) {
      filtered = filtered.filter(pet => pet.type === type);
    }
    
    // Filter by age
    filtered = filtered.filter(pet => pet.age >= age[0] && pet.age <= age[1]);
    
    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(pet => 
        pet.name.toLowerCase().includes(lowerQuery) ||
        (pet.breed && pet.breed.toLowerCase().includes(lowerQuery)) ||
        pet.personality.some(trait => trait.toLowerCase().includes(lowerQuery))
      );
    }
    
    setFilteredPets(filtered);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setSelectedType(type);
    applyFilters(pets, type, ageRange, searchQuery);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAgeRange: [number, number] = [...ageRange];
    const index = parseInt(e.target.dataset.index || '0');
    newAgeRange[index] = parseInt(e.target.value);
    setAgeRange(newAgeRange);
    applyFilters(pets, selectedType, newAgeRange, searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(pets, selectedType, ageRange, query);
  };

  const handleReset = () => {
    setSelectedType('');
    setAgeRange([0, 20]);
    setSearchQuery('');
    setFilteredPets(pets);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Browse Our Pets</h1>
          <p className="mt-2 text-gray-600">Find your perfect companion from our available pets</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Pet Type
              </label>
              <select
                id="type-filter"
                value={selectedType}
                onChange={handleTypeChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                {petTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age Range (years): {ageRange[0]} - {ageRange[1]}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={ageRange[0]}
                  data-index="0"
                  onChange={handleAgeChange}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-8 text-center">{ageRange[0]}</span>
                <span>-</span>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={ageRange[1]}
                  data-index="1"
                  onChange={handleAgeChange}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-8 text-center">{ageRange[1]}</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Name, breed, or traits..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Reset Filters
            </button>
            
            <span className="text-gray-500 text-sm">
              {filteredPets.length} {filteredPets.length === 1 ? 'pet' : 'pets'} found
            </span>
          </div>
        </div>
        
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
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">No pets found matching your filters.</p>
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Show All Pets
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map(pet => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
        
        <div className="mt-12 flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Home
          </Link>
          
          <Link
            href="/find-pet"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Find Your Perfect Match
          </Link>
          
          <Link
            href="/admin/add-pet"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Add New Pet
          </Link>
        </div>
      </div>
    </div>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48">
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
        <h3 className="text-lg font-semibold">{pet.name}</h3>
        <p className="text-sm text-gray-600">{pet.type} • {pet.breed || 'Mixed'} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old</p>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {pet.personality.slice(0, 2).map((trait) => (
            <span 
              key={trait} 
              className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {trait}
            </span>
          ))}
          {pet.personality.length > 2 && (
            <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
              +{pet.personality.length - 2} more
            </span>
          )}
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{pet.description}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <button
            onClick={() => alert('Pet details feature coming soon!')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </button>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ID: {pet.id.substring(0, 4)}
          </span>
        </div>
      </div>
    </div>
  );
} 