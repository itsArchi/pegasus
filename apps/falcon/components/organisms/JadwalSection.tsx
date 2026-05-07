'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar, MapPin, Clock } from 'lucide-react'
import SectionTitle from '@/components/atoms/SectionTitle'
import CountdownDisplay from '@/components/molecules/CountdownDisplay'

gsap.registerPlugin(ScrollTrigger)

const SCHEDULE = [
  {
    time: '10.00 – 12.00',
    title: 'Pembukaan & Parade Budaya',
    desc: 'Upacara pembukaan resmi diikuti parade kostum tradisional Jepang dari berbagai daerah.',
    tag: 'Opening',
  },
  {
    time: '12.00 – 14.00',
    title: 'Bazaar Kuliner Jepang',
    desc: 'Jelajahi puluhan gerai street food autentik — takoyaki, ramen, onigiri, dan banyak lagi.',
    tag: 'Kuliner',
  },
  {
    time: '14.00 – 16.00',
    title: 'Pertunjukan Seni & Budaya',
    desc: 'Penampilan tari tradisional Bon Odori, demonstrasi kendo, dan workshop origami.',
    tag: 'Pertunjukan',
  },
  {
    time: '16.00 – 17.30',
    title: 'Sesi Foto Yukata',
    desc: 'Kenakan yukata premium dan abadikan momen bersama keluarga di spot foto eksklusif.',
    tag: 'Aktivitas',
  },
  {
    time: '19.00 – 21.00',
    title: 'Pesta Kembang Api',
    desc: 'Puncak acara — pertunjukan kembang api spektakuler menghiasi langit malam Tokyo Natsu Matsuri.',
    tag: 'Final',
  },
]

const TAG_COLORS: Record<string, string> = {
  Opening: 'bg-red-600 text-white',
  Kuliner: 'bg-orange-500 text-white',
  Pertunjukan: 'bg-purple-600 text-white',
  Aktivitas: 'bg-blue-600 text-white',
  Final: 'bg-gray-400 text-white',
}

export default function JadwalSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.set('.jadwal-title', { opacity: 0, y: 40 })
      gsap.set('.countdown-wrap', { opacity: 0, y: 30 })
      gsap.set('.jadwal-card', { opacity: 0, x: -40 })

      gsap.to('.jadwal-title', {
        scrollTrigger: { trigger: '.jadwal-title', start: 'top 85%' },
        opacity: 1, y: 0, duration: 1, ease: 'power4.out',
      })
      gsap.to('.countdown-wrap', {
        scrollTrigger: { trigger: '.countdown-wrap', start: 'top 85%' },
        opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power4.out',
      })
      gsap.to('.jadwal-card', {
        scrollTrigger: { trigger: '.jadwal-list', start: 'top 80%' },
        opacity: 1, x: 0, stagger: 0.15, duration: 0.8, ease: 'expo.out',
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="min-h-screen bg-gray-50 pt-44 pb-32 relative overflow-hidden">
      {/* Dekoratif background */}
      <div className="absolute top-0 right-0 text-[18rem] font-black text-gray-100/60 select-none pointer-events-none leading-none">
        祭
      </div>
      <div className="absolute bottom-0 left-0 text-[12rem] font-black text-red-50 select-none pointer-events-none leading-none">
        夏
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Title */}
        <div className="jadwal-title">
          <SectionTitle
            id="jadwal"
            title="Jadwal Acara"
            subtitle="Catat tanggalnya! 7 Juni 2026. Satu hari penuh perayaan budaya Jepang yang tak terlupakan."
          />
        </div>

        {/* Countdown */}
        <div className="countdown-wrap flex flex-col items-center mb-24">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-red-600" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
              Hitung Mundur Menuju Event
            </span>
          </div>
          <CountdownDisplay />
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-red-500" /> Tokyo, Japan
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-red-500" /> 07 Juni 2026
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto jadwal-list">
          <h3 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-widest text-center">
            Rundown Acara
          </h3>
          <div className="relative">
            {/* Garis vertikal */}
            <div className="absolute left-[7.5rem] top-0 bottom-0 w-px bg-gray-200 hidden md:block" />

            <div className="flex flex-col gap-6">
              {SCHEDULE.map((item, i) => (
                <div key={i} className="jadwal-card flex gap-6 md:gap-8 items-start">
                  {/* Waktu */}
                  <div className="w-28 shrink-0 text-right hidden md:block">
                    <span className="text-xs font-black text-gray-400 tracking-wide leading-relaxed">
                      {item.time}
                    </span>
                  </div>

                  {/* Dot */}
                  <div className="hidden md:flex flex-col items-center shrink-0 mt-1">
                    <div className="w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-100 z-10" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 hover:border-red-100 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 group">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-black text-gray-800 text-base group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h4>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 ${TAG_COLORS[item.tag]}`}>
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    <p className="md:hidden mt-3 text-xs font-bold text-red-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
