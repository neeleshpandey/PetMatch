import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getUserById, getAllPets, createMatch, getMatchesByUserId, addSampleData } from '@/app/lib/store'
import { initializeApp, verifyInitialization } from '@/app/lib/init'

// Ensure app is initialized
initializeApp();

// Check if pets were initialized
const initialPets = getAllPets();
console.log(`Match API loaded. Pet count: ${initialPets.length}`);

// Create OpenAI client only if API key is available
let openai: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized');
  } else {
    console.warn('OpenAI API key is missing');
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

export async function POST(req: Request) {
  try {
    // First, verify that initialization was successful
    if (!verifyInitialization()) {
      console.log('Initialization verification failed, forcing reinitialization');
      initializeApp(true);
      
      // Check again
      if (!verifyInitialization()) {
        return NextResponse.json(
          { error: 'System initialization failed. Please try again later.' },
          { status: 500 }
        );
      }
    }
    
    const body = await req.json().catch(error => {
      console.error('Failed to parse request body:', error);
      throw new Error('Invalid request body');
    });
    
    const { userId, forceReload } = body;
    
    if (forceReload) {
      console.log('Force reloading sample data from match POST endpoint');
      addSampleData(true);
    }
    
    if (!userId) {
      console.error('Missing userId in request');
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    
    console.log('Match request for user:', userId);

    // Get user preferences
    const user = getUserById(userId)

    if (!user) {
      console.error('User not found:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all available pets
    const pets = getAllPets()
    console.log('Available pets:', pets.length);
    
    if (pets.length === 0) {
      // If no pets are available, return empty matches
      console.log('No pets available in the database');
      return NextResponse.json({ matches: [] })
    }

    // Check if OpenAI client is available
    if (!openai) {
      console.log('Using fallback matching (no OpenAI client)');
      // Use fallback matching logic with varied scores based on preferences
      const defaultMatches = pets.map(pet => {
        // Generate a more varied match score based on user preferences and pet traits
        let score = 0.5; // Base score
        
        // Check if user has preference for this pet type
        if (user.preferences.includes(pet.type) || 
            user.preferences.includes('Dogs') && pet.type === 'Dog' ||
            user.preferences.includes('Cats') && pet.type === 'Cat' ||
            user.preferences.includes('Small animals') && ['Rabbit', 'Hamster', 'Bird'].includes(pet.type)) {
          score += 0.15;
        }
        
        // Match on activity levels
        if ((user.lifestyle === 'Very Active' || user.lifestyle === 'Active') && 
            pet.personality.some(trait => ['Energetic', 'Active', 'Playful'].includes(trait))) {
          score += 0.1;
        } else if (user.lifestyle === 'Moderate' && 
                  pet.personality.some(trait => ['Friendly', 'Social', 'Gentle'].includes(trait))) {
          score += 0.1;
        } else if ((user.lifestyle === 'Relaxed' || user.lifestyle === 'Sedentary') && 
                  pet.personality.some(trait => ['Calm', 'Quiet', 'Independent'].includes(trait))) {
          score += 0.1;
        }
        
        // Add some randomness for variety
        score += Math.random() * 0.15;
        
        // Ensure score is between 0.3 and 0.95
        score = Math.max(0.3, Math.min(0.95, score));
        score = parseFloat(score.toFixed(2)); // Round to 2 decimal places
        
        return createMatch({
          petId: pet.id,
          userId,
          score,
          status: 'pending'
        });
      });
      
      // Get the matches with pet data for the response
      const matchesWithPets = getMatchesByUserId(userId);
      console.log('Generated matches with pets:', matchesWithPets.length);
      
      return NextResponse.json({ 
        matches: matchesWithPets,
        warning: "Used fallback matching (OpenAI not available)"
      });
    }

    try {
      // Use OpenAI to analyze compatibility
      const prompt = `Given a user with the following preferences and characteristics:
      - Preferences: ${user.preferences.join(', ')}
      - Lifestyle: ${user.lifestyle}
      - Pet experience: ${user.experience}

      Please analyze the compatibility with these pets and provide a compatibility score (0-1) for each:
      ${pets.map(pet => `
      Pet ID: ${pet.id}
      Type: ${pet.type}
      Breed: ${pet.breed}
      Age: ${pet.age}
      Personality traits: ${pet.personality.join(', ')}
      Description: ${pet.description}
      `).join('\n')}

      Provide the response as a JSON object with a "matches" property containing an array of objects with "petId" and "score" properties.`

      console.log('Sending request to OpenAI');
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        response_format: { type: 'json_object' },
      })

      // Safely parse the OpenAI response
      let matchData;
      try {
        const content = completion.choices[0].message.content;
        console.log('OpenAI response received:', content ? 'yes' : 'no');
        const parsedContent = JSON.parse(content || '{}');
        matchData = parsedContent.matches || [];
        console.log('Parsed matches:', matchData.length);
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        // Fallback: assign default scores if parsing fails
        matchData = pets.map(pet => {
          // Generate a more varied match score based on user preferences and pet traits
          let score = 0.5; // Base score
          
          // Check if user has preference for this pet type
          if (user.preferences.includes(pet.type) || 
              user.preferences.includes('Dogs') && pet.type === 'Dog' ||
              user.preferences.includes('Cats') && pet.type === 'Cat' ||
              user.preferences.includes('Small animals') && ['Rabbit', 'Hamster', 'Bird'].includes(pet.type)) {
            score += 0.15;
          }
          
          // Match on activity levels
          if ((user.lifestyle === 'Very Active' || user.lifestyle === 'Active') && 
              pet.personality.some(trait => ['Energetic', 'Active', 'Playful'].includes(trait))) {
            score += 0.1;
          } else if (user.lifestyle === 'Moderate' && 
                    pet.personality.some(trait => ['Friendly', 'Social', 'Gentle'].includes(trait))) {
            score += 0.1;
          } else if ((user.lifestyle === 'Relaxed' || user.lifestyle === 'Sedentary') && 
                    pet.personality.some(trait => ['Calm', 'Quiet', 'Independent'].includes(trait))) {
            score += 0.1;
          }
          
          // Add some randomness for variety
          score += Math.random() * 0.15;
          
          // Ensure score is between 0.3 and 0.95
          score = Math.max(0.3, Math.min(0.95, score));
          score = parseFloat(score.toFixed(2)); // Round to 2 decimal places
          
          return {
            petId: pet.id,
            score: score
          };
        });
        console.log('Using default matches due to parse error');
      }

      // Store matches in memory
      const createdMatches = matchData.map((match: { petId: string; score: number }) =>
        createMatch({
          petId: match.petId,
          userId,
          score: match.score,
          status: 'pending'
        })
      )

      console.log('Created matches:', createdMatches.length);
      
      // Get the matches with pet data for the response
      const matchesWithPets = getMatchesByUserId(userId);
      console.log('Final matches with pets:', matchesWithPets.length);
      
      return NextResponse.json({ matches: matchesWithPets })
    } catch (aiError) {
      console.error('OpenAI API error:', aiError);
      
      // Ensure we include detailed error information in the response for debugging
      const errorResponse = {
        error: 'Failed to generate AI-powered matches',
        details: aiError instanceof Error ? aiError.message : String(aiError),
        fallback: 'Using default matching algorithm instead'
      };
      
      // Fallback: Create default matches with varied scores for all pets
      const defaultMatches = pets.map(pet => {
        // Generate a more varied match score based on user preferences and pet traits
        let score = 0.5; // Base score
        
        // Check if user has preference for this pet type
        if (user.preferences.includes(pet.type) || 
            user.preferences.includes('Dogs') && pet.type === 'Dog' ||
            user.preferences.includes('Cats') && pet.type === 'Cat' ||
            user.preferences.includes('Small animals') && ['Rabbit', 'Hamster', 'Bird'].includes(pet.type)) {
          score += 0.15;
        }
        
        // Match on activity levels
        if ((user.lifestyle === 'Very Active' || user.lifestyle === 'Active') && 
            pet.personality.some(trait => ['Energetic', 'Active', 'Playful'].includes(trait))) {
          score += 0.1;
        } else if (user.lifestyle === 'Moderate' && 
                  pet.personality.some(trait => ['Friendly', 'Social', 'Gentle'].includes(trait))) {
          score += 0.1;
        } else if ((user.lifestyle === 'Relaxed' || user.lifestyle === 'Sedentary') && 
                  pet.personality.some(trait => ['Calm', 'Quiet', 'Independent'].includes(trait))) {
          score += 0.1;
        }
        
        // Add some randomness for variety
        score += Math.random() * 0.15;
        
        // Ensure score is between 0.3 and 0.95
        score = Math.max(0.3, Math.min(0.95, score));
        score = parseFloat(score.toFixed(2)); // Round to 2 decimal places
        
        return createMatch({
          petId: pet.id,
          userId,
          score,
          status: 'pending'
        });
      });
      
      // Get the matches with pet data for the response
      const matchesWithPets = getMatchesByUserId(userId);
      console.log(`Created ${defaultMatches.length} fallback matches due to error`);
      
      // Return the matches with the error information
      return NextResponse.json({ 
        matches: matchesWithPets,
        warning: errorResponse
      });
    }
  } catch (error) {
    console.error('Error in match route POST:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate matches', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // First, verify that initialization was successful
    if (!verifyInitialization()) {
      console.log('Initialization verification failed in GET, forcing reinitialization');
      initializeApp(true);
      
      // Check again
      if (!verifyInitialization()) {
        return NextResponse.json(
          { error: 'System initialization failed. Please try again later.' },
          { status: 500 }
        );
      }
    }
    
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      console.error('Missing userId in GET request');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get matches with pet data
    const matches = getMatchesByUserId(userId)
    console.log(`GET matches for ${userId}:`, matches.length);
    
    if (!matches || matches.length === 0) {
      console.log(`No matches found for user ${userId}`);
    }

    return NextResponse.json({ matches })
  } catch (error) {
    console.error('Error in match route GET:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches', details: (error as Error).message },
      { status: 500 }
    )
  }
} 