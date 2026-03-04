const languages = [
  { flag: '🇹🇼', name: '繁體中文', phrase: '「全家人的中國健康假期」' },
  { flag: '🇹🇭', name: 'ไทย', phrase: 'วันหยุดสุขภาพสำหรับครอบครัว' },
  { flag: '🇲🇾', name: 'Melayu', phrase: 'Percuti Kesihatan untuk Keluarga' },
  { flag: '🇮🇩', name: 'Indonesia', phrase: 'Liburan Sehat untuk Keluarga' },
  { flag: '🇻🇳', name: 'Tiếng Việt', phrase: 'Kỳ Nghỉ Sức Khỏe Cho Gia Đình' },
  { flag: '🇵🇭', name: 'Filipino', phrase: 'Healthy Vacation para sa Pamilya' },
]

export default function LanguageShowcase() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Available in Your Language</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {languages.map((lang, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl mb-2">{lang.flag}</div>
              <div className="font-semibold">{lang.name}</div>
              <div className="text-sm text-gray-600 mt-1">{lang.phrase}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}