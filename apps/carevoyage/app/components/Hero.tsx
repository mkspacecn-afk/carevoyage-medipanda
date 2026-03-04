'use client'

import { useState } from 'react'
import { Search, Users, TrendingDown, Clock, Award } from 'lucide-react'

const stats = [
  { number: '3,400+', label: 'Global Patients', icon: Users },
  { number: '60%', label: 'Cost Savings', icon: TrendingDown },
  { number: '72hr', label: 'Fastest Access', icon: Clock },
  { number: '98%', label: 'Satisfaction', icon: Award },
]

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#1E3A5F]/10 text-[#1E3A5F] px-4 py-2 rounded-full text-sm font-semibold mb-8">
          <span>🏥</span>
          Partnered with West China Hospital · Top 3 in China
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#1E3A5F] mb-6">
          Your Health Journey
          <br />
          <span className="font-bold">Starts Here</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Experience China&apos;s world-class medical care with personalized service.
          From precision health screening to specialized treatments.
        </p>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="flex bg-white rounded-full shadow-lg p-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe your health needs (e.g., health screening, dental, TCM)..."
              className="flex-1 px-6 py-4 text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
            <button className="bg-[#7CB342] text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-[#6ba035] transition-colors">
              <Search className="w-5 h-5" />
              AI Match
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <stat.icon className="w-6 h-6 text-[#7CB342]" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-[#1E3A5F]">{stat.number}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}