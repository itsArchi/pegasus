import Image from 'next/image'
import { GithubIcon } from '@/components/atoms/Icons'

export default function Footer() {
  return (
    <footer className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.jpg"
            alt="Japan Fest Logo"
            width={100}
            height={100}
            style={{ width: 100, height: 100, objectFit: 'contain' }}
            className="rounded-full shadow-xl shadow-red-600/10"
          />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">
          Japan Fest <span className="text-red-600">2026</span>
        </h2>
        <p className="text-gray-400 font-black tracking-[0.3em] uppercase mb-8 text-sm">
          Harmoni Budaya Jepang & Indonesia
        </p>
        <a
          href="https://github.com/itsArchi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 text-sm font-medium italic flex justify-center items-center gap-2 hover:text-gray-500 transition-colors mb-2"
        >
          <GithubIcon size={16} />
          itsArchi
        </a>
        <p className="text-gray-300 text-sm font-medium italic">
          © 2026 Tokyo Natsu Matsuri Fest.
        </p>
      </div>
    </footer>
  )
}
