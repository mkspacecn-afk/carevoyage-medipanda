const packages = [
  {
    name: 'Chengdu Family Health Trip',
    hospital: 'West China Hospital · Top 3 in China',
    price: '$2,800',
    tag: '🏥 Partner Hospital',
    features: [
      'Comprehensive health screening for family of 3',
      'Panda Base VIP access (skip the lines)',
      '3 nights at 4-star family hotel',
      'Dedicated Panda Coordinator',
      'Airport & Hospital transfers included'
    ],
    save: 'Save $500',
    color: 'from-[#4CAF50] to-[#388E3C]'
  },
  {
    name: 'TCM Wellness Experience',
    hospital: 'Sichuan TCM Hospital · National Masters',
    price: '$1,200',
    tag: '🌿 Traditional Medicine',
    features: [
      'TCM constitution analysis',
      'Acupuncture & therapeutic massage',
      'Medicinal cuisine experience',
      'Ciqikou Ancient Town tour',
      'Take-home wellness package'
    ],
    save: 'Perfect for parents',
    color: 'from-[#8BC34A] to-[#689F38]'
  }
]

export default function Packages() {
  return (
    <section className="py-20 bg-gray-50" id="packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Popular Family Packages</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {packages.map((p, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow border border-gray-100">
              <div className={`bg-gradient-to-br ${p.color} p-8 text-white relative`}>
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs mb-3">{p.tag}</span>
                <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                <p className="text-sm opacity-90">{p.hospital}</p>
              </div>
              <div className="p-8">
                <div className="space-y-4 mb-8">
                  {p.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-3 text-gray-700">
                      <span className="text-lg">✅</span>
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div>
                    <span className="text-3xl font-bold text-[#FF8A65]">{p.price}</span>
                    <span className="text-xs text-gray-400 ml-1">/ package</span>
                  </div>
                  <button className="bg-[#4CAF50] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#388E3C] transition-colors">
                    Book Now
                  </button>
                </div>
                <div className="mt-2 text-xs text-[#4CAF50] font-semibold">{p.save}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
