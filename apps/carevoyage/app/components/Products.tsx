'use client'

import { useState } from 'react'
import { Check, Star, ArrowRight } from 'lucide-react'

const products = [
  {
    id: 'health-screening',
    icon: '🔬',
    title: 'Precision Health Screening · Cancer Early Detection',
    description: 'Comprehensive screening packages including PET-CT, tumor markers, and genetic testing',
    badge: 'Most Popular',
    hospitals: [
      {
        name: 'West China Hospital',
        type: 'Top 3 in China',
        price: '$12,000',
        featured: true,
        exclusive: 'Gold Standard',
      },
      {
        name: 'Chongqing Medical #1',
        type: 'SW China Leader',
        price: '$8,000',
        featured: false,
      },
      {
        name: 'Chongqing Medical #2',
        type: 'Specialty Focus',
        price: '$6,500',
        featured: false,
      },
      {
        name: 'Sichuan TCM Hospital',
        type: 'TCM + Wellness',
        price: '$6,000',
        featured: false,
      },
    ],
    features: ['PET-CT scan', '12 tumor markers', 'Genetic testing', 'Expert consultation', 'Bilingual report'],
  },
  {
    id: 'dental',
    icon: '🦷',
    title: 'Dental Implant · Immediate Loading Technology',
    description: 'State-of-the-art dental implants with same-day temporary restoration',
    badge: 'Exclusive Tech',
    hospitals: [
      {
        name: 'West China Dental',
        type: 'Exclusive Technology',
        price: '$15,000',
        featured: true,
        exclusive: 'Only Here',
      },
      {
        name: 'Chongqing Medical #2',
        type: 'Standard Implants',
        price: '$8,000',
        featured: false,
      },
    ],
    features: ['Immediate loading', 'Imported implants', 'Full ceramic crown', 'Post-op care', '5-year warranty'],
  },
  {
    id: 'tcm',
    icon: '🌿',
    title: 'TCM Wellness · Master Physician Clinic',
    description: 'Traditional Chinese Medicine consultation with National Master-level physicians',
    badge: null,
    hospitals: [
      {
        name: 'Sichuan TCM Hospital',
        type: 'National Master Team',
        price: '$5,000',
        featured: true,
        exclusive: 'Exclusive',
      },
    ],
    features: ['Constitution analysis', 'Acupuncture', 'Herbal medicine', 'Dietary therapy', 'Wellness plan'],
  },
]

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState(products[0])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#7CB342] font-semibold text-sm uppercase tracking-wider mb-2">Medical Services</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F]">Select Service & Hospital</h2>
        </div>

        {/* Product Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedProduct.id === product.id
                  ? 'bg-[#1E3A5F] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{product.icon}</span>
              {product.title.split('·')[0]}
            </button>
          ))}
        </div>

        {/* Selected Product Detail */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selectedProduct.icon}</span>
                <h3 className="text-2xl font-bold text-[#1E3A5F]">{selectedProduct.title}</h3>
              </div>
              <p className="text-gray-600">{selectedProduct.description}</p>
            </div>
            {selectedProduct.badge && (
              <span className="bg-[#C9A227] text-white px-4 py-2 rounded-full text-sm font-semibold">
                {selectedProduct.badge}
              </span>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-3 mb-8">
            {selectedProduct.features.map((feature, idx) => (
              <span key={idx} className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Check className="w-4 h-4 text-[#7CB342]" />
                {feature}
              </span>
            ))}
          </div>

          {/* Hospitals */}
          <h4 className="text-lg font-semibold text-[#1E3A5F] mb-4">Available Hospitals</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedProduct.hospitals.map((hospital, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  hospital.featured
                    ? 'border-[#1E3A5F] bg-gradient-to-br from-[#1E3A5F] to-[#2a4a73] text-white'
                    : 'border-gray-200 hover:border-[#1E3A5F] bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏥</span>
                  <span className="font-semibold">{hospital.name}</span>
                </div>
                <p className={`text-sm mb-3 ${hospital.featured ? 'text-white/80' : 'text-gray-500'}`}>
                  {hospital.type}
                </p>
                <div className={`text-2xl font-bold mb-2 ${hospital.featured ? 'text-[#fbbf24]' : 'text-[#7CB342]'}`}>
                  {hospital.price}
                </div>
                {hospital.exclusive && (
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                    hospital.featured ? 'bg-white/20' : 'bg-[#C9A227] text-white'
                  }`}>
                    <Star className="w-3 h-3" />
                    {hospital.exclusive}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <button className="bg-[#1E3A5F] text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-[#0A1F44] transition-colors">
              Compare All Options
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}