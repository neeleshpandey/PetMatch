import { NextResponse } from 'next/server'
import { getAllPets, getPetCount } from '@/app/lib/store'
import { initializeApp, verifyInitialization } from '@/app/lib/init'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const reload = searchParams.get('reload') === 'true'
    const forceInit = searchParams.get('force') === 'true'
    
    let initStatus = 'not requested';
    
    if (reload || forceInit) {
      console.log('Debug route: Force reloading sample data')
      const success = initializeApp(true)
      initStatus = success ? 'succeeded' : 'failed';
    } else {
      // Just verify without forcing
      initStatus = verifyInitialization() ? 'verified' : 'failed verification';
    }
    
    const pets = getAllPets()
    const petCount = getPetCount()
    
    return NextResponse.json({
      status: 'ok',
      petCount,
      reload: reload ? 'forced reload' : 'not requested',
      initialization: initStatus,
      petSample: pets.slice(0, 3).map(p => ({ id: p.id, name: p.name, type: p.type }))
    })
  } catch (error) {
    console.error('Error in debug route:', error)
    return NextResponse.json(
      { 
        error: 'Debug route error',
        message: (error as Error).message,
        stack: (error as Error).stack
      },
      { status: 500 }
    )
  }
} 