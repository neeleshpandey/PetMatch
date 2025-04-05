import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './lib/init'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pet Match - Find Your Perfect Pet',
  description: 'AI-powered pet matching service that connects you with your ideal animal companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`} suppressHydrationWarning>
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <span className="text-blue-600 font-bold text-xl">PetMatch</span>
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link href="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Home
                  </Link>
                  <Link href="/find-pet" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Find a Pet
                  </Link>
                  <Link href="/browse" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Browse Pets
                  </Link>
                  <Link href="/admin/pets" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Admin
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About PetMatch</h3>
                <p className="text-gray-300">
                  We connect people with their perfect pet companions using advanced AI matching technology.
                  Our mission is to create lasting, loving relationships between pets and their owners.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/find-pet" className="text-gray-300 hover:text-white transition-colors">
                      Find a Pet
                    </Link>
                  </li>
                  <li>
                    <Link href="/browse" className="text-gray-300 hover:text-white transition-colors">
                      Browse Pets
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/debug" className="text-gray-300 hover:text-white transition-colors">
                      Debug
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-300 mb-2">Have questions or need assistance?</p>
                <a href="mailto:info@petmatch.example.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  info@petmatch.example.com
                </a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} PetMatch. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
