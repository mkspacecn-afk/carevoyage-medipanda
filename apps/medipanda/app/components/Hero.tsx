'use client'

import { useState } from 'react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#4CAF50] to-[#388E3C] py-20 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">A Healthy Vacation for the Whole Family</h1>
          <p className="text-lg opacity-90 mb-10">Let Panda be your guide to China's quality healthcare. Safe, affordable, and full of wonderful memories.</p>
          
          <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-2xl">
            <div className="flex-1 w-full text-gray-700">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Family Members</label>
              <input type="text" placeholder="e.g., 2 adults + 1 child" className="w-full p-2 text-lg outline-none border-b-2 border-gray-100 focus:border-[#4CAF50] transition-colors" />
            </div>
            <button className="w-full md:w-auto bg-[#FF8A65] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#ff7a50] transition-colors whitespace-nowrap">
              Get Family Quote →
            </button>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 text-[300px] opacity-10 select-none pointer-events-none">🐼</div>
    </section>
  )
}
