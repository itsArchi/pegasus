'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import Button from '@/components/atoms/Button'

const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Jadwal', href: '/jadwal' },
  { label: 'Tiket', href: '#products' },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  function scrollTo(id: string) {
    if (pathname !== '/') {
      router.push(`/#${id}`)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-10 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl">
      <div className="bg-white/70 backdrop-blur-2xl border border-white/20 px-10 py-4 rounded-[2.5rem] flex justify-between items-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <Image
            src="/logo.jpg"
            alt="Japan Fest Logo"
            width={48}
            height={48}
            style={{ width: 48, height: 48, objectFit: 'contain' }}
            className="rounded-full group-hover:scale-110 transition-transform duration-500 shadow-lg"
          />
          <span className="font-black text-gray-900 tracking-tighter text-2xl group-hover:text-red-600 transition-colors">
            Japan Fest
          </span>
        </Link>

        <div className="hidden lg:flex gap-12 text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
          {NAV_LINKS.map((item) => {
            const isAnchor = item.href.startsWith('#')
            return isAnchor ? (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href.slice(1))}
                className="hover:text-red-600 transition-colors relative group cursor-pointer"
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-red-600 transition-all duration-500 group-hover:w-full" />
              </button>
            ) : (
              <Link key={item.href} href={item.href} className="hover:text-red-600 transition-colors relative group">
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-red-600 transition-all duration-500 group-hover:w-full" />
              </Link>
            )
          })}
        </div>

        <Button
          variant="primary"
          onClick={() => scrollTo('daftar-undian')}
          className="hidden sm:flex px-8 py-3 text-sm uppercase tracking-widest"
        >
          Daftar Undian
        </Button>
      </div>
    </nav>
  )
}
