import { Heart, Clock, ShieldCheck, DollarSign } from 'lucide-react'

const benefits = [
  { icon: DollarSign, title: 'Great Value', desc: 'Save 50%+ vs your home country' },
  { icon: Clock, title: 'Quick Setup', desc: 'Plan your trip within 1 week' },
  { icon: ShieldCheck, title: 'Peace of Mind', desc: 'Insurance + Bilingual support' },
  { icon: Heart, title: 'Panda Care', desc: 'Warm hospitality for your family' },
]

export default function Benefits() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4 text-[#4CAF50]">
                <b.icon className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900">{b.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
