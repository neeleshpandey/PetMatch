import { NextResponse } from 'next/server'
import { createPet, getAllPets } from '@/app/lib/store'
import { initializeApp, verifyInitialization } from '@/app/lib/init'

// Ensure data is initialized
initializeApp();

export async function GET() {
  try {
    // Verify initialization first
    if (!verifyInitialization()) {
      console.log('Initialization verification failed in GET pets, forcing reinitialization');
      initializeApp(true);
    }
    
    const pets = getAllPets();
    console.log(`GET pets: ${pets.length} pets found`);
    
    return NextResponse.json({ pets });
  } catch (error) {
    console.error('Error in GET pets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pets', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Verify initialization first
    if (!verifyInitialization()) {
      console.log('Initialization verification failed in POST pet, forcing reinitialization');
      initializeApp(true);
    }
    
    const body = await req.json().catch(error => {
      console.error('Failed to parse request body:', error);
      throw new Error('Invalid request body');
    });
    
    // Validate required fields
    const { name, type, breed, age, description, personality } = body;
    
    if (!name || !type || age === undefined || !description || !personality) {
      return NextResponse.json(
        { error: 'Missing required fields', required: ['name', 'type', 'age', 'description', 'personality'] },
        { status: 400 }
      );
    }
    
    // Create the new pet
    const newPet = createPet({
      name,
      type,
      breed: breed || null,
      age: Number(age),
      description,
      imageUrl: body.imageUrl || getDefaultImageForType(type),
      personality: Array.isArray(personality) ? personality : [personality],
    });
    
    console.log(`Created new pet: ${newPet.name} (${newPet.type})`);
    
    return NextResponse.json({ pet: newPet });
  } catch (error) {
    console.error('Error in POST pet:', error);
    return NextResponse.json(
      { error: 'Failed to create pet', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Helper function to get default image URLs by animal type
function getDefaultImageForType(type: string): string {
  const typeMap: Record<string, string> = {
    'Dog': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop',
    'Cat': 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=400&auto=format&fit=crop',
    'Rabbit': 'https://images.unsplash.com/photo-1535241749838-299277b6305f?q=80&w=400&auto=format&fit=crop',
    'Hamster': 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=400&auto=format&fit=crop',
    'Bird': 'https://images.unsplash.com/photo-1501720804996-ae418d1ba820?q=80&w=400&auto=format&fit=crop',
  };
  
  return typeMap[type] || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop';
} 