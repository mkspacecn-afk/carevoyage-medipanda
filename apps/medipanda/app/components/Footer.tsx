export default function Footer() {
  return (
    <footer className="bg-[#2E7D32] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐼</span>
              <span className="font-bold text-xl">MediPanda</span>
            </div>
            <p className="text-white/80">Healing with Panda Hospitality</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-white/80">
              <li>Health Screening</li>
              <li>Dental Care</li>
              <li>TCM Wellness</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-white/80">
              <li>hello@medipandachina.com</li>
              <li>+852 1234 5678</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          © 2026 MediPanda. All rights reserved.
        </div>
      </div>
    </footer>
  )
}