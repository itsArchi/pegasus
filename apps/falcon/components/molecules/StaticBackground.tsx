import { memo } from 'react'

const LANTERNS = Array.from({ length: 20 }, (_, i) => ({
  top: `${(i * 37 + 11) % 100}%`,
  left: `${(i * 53 + 7) % 100}%`,
  large: i % 2 === 0,
}))

const StaticBackground = memo(function StaticBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop"
        alt=""
        aria-hidden="true"
        className="hero-bg-img w-full h-[120%] object-cover opacity-10 absolute -top-[10%]"
        loading="eager"
      />
      <div className="absolute inset-0 bg-linear-to-b from-red-50/50 via-white to-white" />

      <div className="parallax-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-black text-red-600/[0.03] whitespace-nowrap pointer-events-none select-none z-0">
        夏祭り 2026
      </div>

      {LANTERNS.map((l, i) => (
        <div
          key={i}
          className={`lantern-float absolute rounded-full blur-[1px] z-10 ${l.large ? 'w-8 h-10 bg-red-500/20' : 'w-5 h-7 bg-red-300/20'}`}
          style={{ top: l.top, left: l.left }}
        />
      ))}
    </div>
  )
})

export default StaticBackground
