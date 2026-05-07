import Navbar from '@/components/organisms/Navbar'
import HeroSection from '@/components/organisms/HeroSection'
import ProductSection from '@/components/organisms/ProductSection'
import FormSection from '@/components/organisms/FormSection'
import Footer from '@/components/organisms/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden selection:bg-red-600 selection:text-white">
      <Navbar />
      <HeroSection />
      <ProductSection />
      <FormSection />
      <Footer />
    </main>
  )
}
