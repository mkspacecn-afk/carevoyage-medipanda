import { Zap, Building2, Users } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Expedited Access',
    description: 'Appointment within 72 hours with our Express Priority. Standard appointments available within 7-14 days.',
    color: 'bg-[#1E3A5F]',
  },
  {
    icon: Building2,
    title: 'Premier Hospitals',
    description: 'Direct partnerships with West China Hospital (Top 3), Chongqing Medical University, and Sichuan TCM Hospital.',
    color: 'bg-[#1E3A5F]',
  },
  {
    icon: Users,
    title: 'Three-Person Team',
    description: 'Your dedicated team: Health Concierge + Medical Coordinator + Journey Curator, available 24/7.',
    color: 'bg-[#1E3A5F]',
  },
]

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="concierge">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#7CB342] font-semibold text-sm uppercase tracking-wider mb-2">Why Choose CareVoyage</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F]">The CareVoyage Advantage</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1E3A5F] mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}