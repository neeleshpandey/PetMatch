import { NextResponse } from 'next/server'
import { createUser } from '@/app/lib/store'

export async function POST(req: Request) {
  try {
    const { name, email, preferences, lifestyle, experience } = await req.json()

    // Basic validation
    if (!name || !email || !preferences || !preferences.length || !lifestyle || !experience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating user:', { name, email, preferences, lifestyle, experience });
    
    const user = createUser({
      name,
      email,
      preferences,
      lifestyle,
      experience,
    })

    console.log('User created with ID:', user.id);
    
    return NextResponse.json({ userId: user.id })
  } catch (error) {
    console.error('Error in users route:', error)
    return NextResponse.json(
      { error: 'Failed to create user', details: (error as Error).message },
      { status: 500 }
    )
  }
} 