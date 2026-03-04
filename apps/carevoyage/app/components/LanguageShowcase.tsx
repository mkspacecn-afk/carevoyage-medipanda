const languages = [
  { flag: '🇹🇼', name: '繁體中文 · Traditional Chinese', phrase: '「您的健康之旅，從這裡開始」', desc: '華西頂級醫療 · 專屬管家服務 · 三人全程陪伴' },
  { flag: '🇫🇷', name: 'Français · French', phrase: '"Votre voyage santé commence ici"', desc: 'Excellence médicale chinoise · Conciergerie dédiée' },
  { flag: '🇩🇪', name: 'Deutsch · German', phrase: '"Ihre Gesundheitsreise beginnt hier"', desc: 'Chinesische Spitzenmedizin · Persönlicher Concierge' },
  { flag: '🇵🇹', name: 'Português · Portuguese', phrase: '"Sua jornada de saúde começa aqui"', desc: 'Excelência médica chinesa · Conciergeria dedicada' },
  { flag: '🇪🇸', name: 'Español · Spanish', phrase: '"Su viaje de salud comienza aquí"', desc: 'Excelencia médica china · Concierge dedicado' },
  { flag: '🇹🇭', name: 'ไทย · Thai', phrase: '"การเดินทางสู่สุขภาพของคุณเริ่มต้นที่นี่"', desc: 'การแพทย์ระดับสูงของจีน · ผู้ช่วยส่วนตัว' },
]

export default function LanguageShowcase() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-4">🌍 Available in Your Language</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We speak your language. Our team provides support in 7 languages to ensure seamless communication throughout your medical journey.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((lang, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-[#7CB342]">
              <div className="text-4xl mb-3">{lang.flag}</div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{lang.name}</p>
              <p className="text-lg font-semibold text-[#1E3A5F] mb-2">{lang.phrase}</p>
              <p className="text-sm text-gray-600">{lang.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}