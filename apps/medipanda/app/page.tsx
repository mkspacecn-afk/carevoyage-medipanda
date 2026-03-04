import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Packages from './components/Packages'
import Hospitals from './components/Hospitals'
import LanguageShowcase from './components/LanguageShowcase'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Benefits />
      <Packages />
      <Hospitals />
      <LanguageShowcase />
      <Footer />
    </main>
  )
}
