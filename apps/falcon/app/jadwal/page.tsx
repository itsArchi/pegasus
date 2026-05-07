import Navbar from '@/components/organisms/Navbar'
import JadwalSection from '@/components/organisms/JadwalSection'
import Footer from '@/components/organisms/Footer'

export const metadata = { title: 'Jadwal — Japan Fest 2026' }

export default function JadwalPage() {
  return (
    <main>
      <Navbar />
      <JadwalSection />
      <Footer />
    </main>
  )
}
