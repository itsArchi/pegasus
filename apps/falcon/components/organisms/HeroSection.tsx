'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight, Sparkles } from 'lucide-react'
import Button from '@/components/atoms/Button'
import StaticBackground from '@/components/molecules/StaticBackground'

gsap.registerPlugin(ScrollTrigger)

const TITLES = ['TOKYO 夏祭り 2026', '日本 FEST 2026']
const JAPANESE_RE = /[　-〿぀-ゟ゠-ヿ＀-ﾟ一-龯㐀-䶿]/

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const [displayText, setDisplayText] = useState(TITLES[0])
  const titleIndex = useRef(0)

  useGSAP(
    () => {
      gsap.to('.hero-bg-img', {
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        y: 150,
        ease: 'none',
      })
      gsap.to('.parallax-text', {
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        x: -100,
        opacity: 0,
        ease: 'none',
      })
      gsap.to('.lantern-float', {
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
        y: (i: number) => -200 - i * 10,
        opacity: 0,
      })
      gsap.to('.hero-subtitle', { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 1.2 })
      gsap.to('.hero-btns', { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 1.5 })
      gsap.to('.lantern-float', {
        y: '-=30',
        x: '+=20',
        rotation: 'random(-15, 15)' as unknown as number,
        duration: 'random(3, 5)' as unknown as number,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2,
      })
    },
    { scope: heroRef }
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.char',
        { opacity: 0, y: 40, rotateX: -90, filter: 'blur(10px)' },
        { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.05, ease: 'power4.out' }
      )
      const timer = setTimeout(() => {
        gsap.to('.char', {
          opacity: 0,
          y: -30,
          filter: 'blur(10px)',
          stagger: 0.03,
          duration: 0.5,
          ease: 'power4.in',
          onComplete: () => {
            titleIndex.current = (titleIndex.current + 1) % TITLES.length
            setDisplayText(TITLES[titleIndex.current])
          },
        })
      }, 4500)
      return () => clearTimeout(timer)
    })
    return () => ctx.revert()
  }, [displayText])

  return (
    <section
      ref={heroRef}
      className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-white"
    >
      <StaticBackground />

      <div className="container mx-auto px-6 relative z-20 text-center">
        <h1 className="text-6xl md:text-9xl font-black text-gray-900 mb-10 tracking-tighter leading-[1.1] perspective-[1000px] min-h-[1.2em] drop-shadow-sm">
          {displayText.split('').map((char, i) => (
            <span
              key={`${displayText}-${i}`}
              className={`char inline-block whitespace-pre ${JAPANESE_RE.test(char) ? 'text-red-600' : ''}`}
            >
              {char}
            </span>
          ))}
        </h1>

        <p className="hero-subtitle text-xl md:text-3xl text-gray-500 mb-14 max-w-4xl mx-auto font-bold opacity-0 translate-y-12 leading-relaxed">
          Semangat{' '}
          <span className="text-red-600 underline decoration-red-600/30 underline-offset-8">Musim Panas</span> &{' '}
          <span className="border-b-4 border-red-600">Tradisi</span> yang hidup.
        </p>

        <div className="hero-btns flex flex-col sm:flex-row gap-8 justify-center opacity-0 scale-95">
          <Button variant="primary" className="text-xl px-12 py-5 shadow-2xl shadow-red-600/40">
            Bergabung Sekarang <ChevronRight size={24} />
          </Button>
          <Button variant="secondary" className="text-xl px-12 py-5">
            Panduan Festival
          </Button>
        </div>
      </div>
    </section>
  )
}
