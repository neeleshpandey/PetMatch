// Simple in-memory data store to replace Prisma

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  age: number;
  description: string;
  imageUrl?: string;
  personality: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: string[];
  lifestyle: string;
  experience: string;
}

export interface Match {
  id: string;
  petId: string;
  userId: string;
  score: number;
  status: string;
  createdAt: Date;
}

// In-memory stores
let pets: Pet[] = [];
let users: User[] = [];
let matches: Match[] = [];

// Expose the pet count for debugging
export const getPetCount = () => pets.length;

// Export the pets array for direct access
export const getPets = () => pets;

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Pet functions
export const createPet = (pet: Omit<Pet, 'id'>): Pet => {
  const newPet = { ...pet, id: generateId() };
  pets.push(newPet);
  return newPet;
};

export const getAllPets = (): Pet[] => {
  return pets;
};

export const getPetById = (id: string): Pet | undefined => {
  return pets.find(pet => pet.id === id);
};

// User functions
export const createUser = (user: Omit<User, 'id'>): User => {
  const newUser = { ...user, id: generateId() };
  users.push(newUser);
  return newUser;
};

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Match functions
export const createMatch = (match: Omit<Match, 'id' | 'createdAt'>): Match => {
  const newMatch = { 
    ...match, 
    id: generateId(),
    createdAt: new Date()
  };
  matches.push(newMatch);
  return newMatch;
};

export const getMatchesByUserId = (userId: string): (Match & { pet: Pet })[] => {
  return matches
    .filter(match => match.userId === userId)
    .map(match => {
      const pet = getPetById(match.petId);
      return {
        ...match,
        pet: pet as Pet
      };
    })
    .sort((a, b) => b.score - a.score);
};

// Add some sample data
export function addSampleData(force = false) {
  console.log(`Before initialization: ${pets.length} pets exist`);
  
  // Only add sample data if there are no pets or force is true
  if (pets.length === 0 || force) {
    if (force && pets.length > 0) {
      console.log('Force initializing: clearing existing pets');
      pets = [];
    }
    
    // Dogs
    console.log('Creating sample pets...');
    
    createPet({
      name: 'Max',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: 3,
      description: 'Max is a friendly and energetic Golden Retriever who loves outdoor activities. He gets along well with children and other pets. He\'s trained and responds well to basic commands.',
      imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=624&auto=format&fit=crop',
      personality: ['Friendly', 'Energetic', 'Loyal']
    });
    
    createPet({
      name: 'Rocky',
      type: 'Dog',
      breed: 'German Shepherd',
      age: 4,
      description: 'Rocky is a loyal and protective German Shepherd with excellent training. He\'s great with families and makes an excellent watchdog. He needs regular exercise and mental stimulation.',
      imageUrl: 'https://images.unsplash.com/photo-1605897472359-85e4b94d685d?q=80&w=624&auto=format&fit=crop',
      personality: ['Loyal', 'Protective', 'Intelligent']
    });
    
    createPet({
      name: 'Bella',
      type: 'Dog',
      breed: 'Beagle',
      age: 2,
      description: 'Bella is a curious and playful Beagle who loves to explore. She has a friendly disposition and gets along well with everyone. She enjoys playing fetch and going for walks.',
      imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=624&auto=format&fit=crop',
      personality: ['Friendly', 'Playful', 'Curious']
    });
    
    createPet({
      name: 'Charlie',
      type: 'Dog',
      breed: 'French Bulldog',
      age: 2,
      description: 'Charlie is a charming French Bulldog with a lot of personality. He\'s affectionate, adaptable, and does well in apartments. He loves cuddles and short walks.',
      imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=624&auto=format&fit=crop',
      personality: ['Affectionate', 'Playful', 'Calm']
    });

    // Cats
    createPet({
      name: 'Luna',
      type: 'Cat',
      breed: 'Siamese',
      age: 2,
      description: 'Luna is a quiet and independent Siamese cat. She\'s very clean and enjoys peaceful environments. While she\'s not overly demanding of attention, she forms strong bonds with her owners.',
      imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=624&auto=format&fit=crop',
      personality: ['Quiet', 'Independent', 'Affectionate']
    });
    
    createPet({
      name: 'Oliver',
      type: 'Cat',
      breed: 'Maine Coon',
      age: 3,
      description: 'Oliver is a gentle giant with a sociable personality. This Maine Coon loves being around people and isn\'t shy about seeking attention. He\'s good with children and other pets.',
      imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=624&auto=format&fit=crop',
      personality: ['Gentle', 'Sociable', 'Intelligent']
    });
    
    createPet({
      name: 'Milo',
      type: 'Cat',
      breed: 'Tabby',
      age: 1,
      description: 'Milo is a playful tabby cat with lots of energy. He loves interactive toys and climbing. He\'s young and adaptable, making him a great addition to most homes.',
      imageUrl: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=624&auto=format&fit=crop',
      personality: ['Playful', 'Curious', 'Energetic']
    });

    // Small Animals
    createPet({
      name: 'Coco',
      type: 'Rabbit',
      breed: 'Holland Lop',
      age: 1,
      description: 'Coco is a calm and affectionate Holland Lop rabbit. She enjoys being handled and is litter-trained. She\'s ideal for someone looking for a gentle small pet.',
      imageUrl: 'https://images.unsplash.com/photo-1535241749838-299277b6305f?q=80&w=624&auto=format&fit=crop',
      personality: ['Calm', 'Affectionate', 'Social']
    });
    
    createPet({
      name: 'Nibbles',
      type: 'Hamster',
      breed: 'Syrian',
      age: 1,
      description: 'Nibbles is an active and curious Syrian hamster. He\'s fun to watch as he explores his habitat and enjoys running on his wheel. He\'s a great starter pet for responsible children.',
      imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=624&auto=format&fit=crop',
      personality: ['Active', 'Curious', 'Independent']
    });
    
    createPet({
      name: 'Tiki',
      type: 'Bird',
      breed: 'Budgerigar',
      age: 2,
      description: 'Tiki is a colorful and cheerful budgie who loves to chirp and sing. He can learn to mimic words with patient training. He brings life and joy to any home.',
      imageUrl: 'https://images.unsplash.com/photo-1501720804996-ae418d1ba820?q=80&w=624&auto=format&fit=crop',
      personality: ['Social', 'Vocal', 'Intelligent']
    });

    console.log(`Initialized ${pets.length} pets`);
    
    // Verify pets were added correctly
    if (pets.length === 0) {
      console.error('Failed to add pets! Pets array is still empty after initialization.');
    } else {
      console.log('Sample pets created successfully.');
    }
  } else {
    console.log(`Skipping sample data creation: ${pets.length} pets already exist`);
  }
} 