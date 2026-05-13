import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import DomainsSection from '../components/landing/DomainsSection'
import StepsSection from '../components/landing/StepsSection'
import DiffSection from '../components/landing/DiffSection'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="bg-surface text-ink">
      <Header />
      <Hero />
      <DomainsSection />
      <StepsSection />
      <DiffSection />
      <Footer />
    </div>
  )
}
