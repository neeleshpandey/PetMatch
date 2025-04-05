'use client'
import React, { useState, useEffect } from 'react'

interface DebugInfo {
  status: string;
  petCount: number;
  reload: string;
  initialization: string;
  petSample: Array<{ id: string; name: string; type: string }>;
}

export default function DebugPage() {
  const [info, setInfo] = useState<DebugInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadStatus, setReloadStatus] = useState('')

  const fetchDebugInfo = async (reload = false, force = false) => {
    try {
      setLoading(true)
      setError(null)
      
      let url = '/api/debug';
      if (reload) url += '?reload=true';
      if (force) url += (reload ? '&' : '?') + 'force=true';
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      setInfo(data)
      
      if (reload) {
        setReloadStatus('Sample data reloaded successfully!')
      } else if (force) {
        setReloadStatus('Force initialization triggered successfully!')
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  const handleReload = () => {
    fetchDebugInfo(true)
  }

  const handleForceInit = () => {
    fetchDebugInfo(false, true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Pet Match Debug Info</h1>
        
        {loading ? (
          <div className="text-center p-4">Loading debug information...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        ) : info ? (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">System Status</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Status:</div>
                <div>{info.status}</div>
                <div className="font-medium">Pet Count:</div>
                <div>{info.petCount}</div>
                <div className="font-medium">Last Reload:</div>
                <div>{info.reload}</div>
                <div className="font-medium">Initialization:</div>
                <div>{info.initialization}</div>
              </div>
            </div>
            
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">Pet Sample</h2>
              {info.petSample.length > 0 ? (
                <ul className="divide-y">
                  {info.petSample.map(pet => (
                    <li key={pet.id} className="py-2 flex justify-between">
                      <span>{pet.name}</span>
                      <span className="text-gray-500">{pet.type}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-red-600">No pets found!</div>
              )}
            </div>
            
            {reloadStatus && (
              <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
                {reloadStatus}
              </div>
            )}
            
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleReload}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reload Sample Data
              </button>
              
              <button
                onClick={handleForceInit}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Force Initialization
              </button>
              
              <button
                onClick={() => fetchDebugInfo()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Refresh Info
              </button>
              
              <a 
                href="/find-pet"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center"
              >
                Go to Find Pet Form
              </a>
              
              <a 
                href="/admin/pets"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 inline-flex items-center"
              >
                Manage Pets
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">No debug information available</div>
        )}
      </div>
    </div>
  )
} 