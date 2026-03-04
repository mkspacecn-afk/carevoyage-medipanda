'use client'

import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-[#4CAF50] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐼</span>
            <span className="font-bold text-xl">MediPanda</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#packages" className="hover:text-white/80">Packages</a>
            <a href="#hospitals" className="hover:text-white/80">Hospitals</a>
            <a href="#pricing" className="hover:text-white/80">Pricing</a>
            <button className="bg-[#FF8A65] px-4 py-2 rounded-full font-medium">Book Now</button>
          </div>
        </div>
      </div>
    </nav>
  )
}