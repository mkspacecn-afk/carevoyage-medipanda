const hospitals = [
  { name: 'West China Hospital', type: 'Top 3 China · Comprehensive', icon: '🏥', featured: true },
  { name: 'Chongqing Medical #1', type: 'SW China Leader · Multi-specialty', icon: '🏥', featured: false },
  { name: 'Chongqing Medical #2', type: 'Specialty Focus · Dental', icon: '🏥', featured: false },
  { name: 'Sichuan TCM Hospital', type: 'National Master · TCM', icon: '🌿', featured: false },
  { name: 'Chongqing TCM Hospital', type: 'Wellness & Recovery', icon: '🌿', featured: false },
]

export default function Hospitals() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Choose Your Trusted Hospital</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {hospitals.map((h, i) => (
            <div
              key={i}
              className={`p-8 rounded-3xl text-center min-w-[200px] transition-all cursor-pointer border-2 ${
                h.featured
                  ? 'bg-gradient-to-br from-[#4CAF50] to-[#388E3C] text-white border-transparent shadow-lg scale-105'
                  : 'bg-gray-50 border-transparent hover:border-[#4CAF50] text-gray-900'
              }`}
            >
              <div className="text-4xl mb-4">{h.icon}</div>
              <h4 className="font-bold mb-2">{h.name}</h4>
              <p className={`text-xs ${h.featured ? 'opacity-90' : 'text-gray-500'}`}>{h.type}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
