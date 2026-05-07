'use client'

import { useEffect, useState } from 'react'
import CountdownUnit from '@/components/atoms/CountdownUnit'

const TARGET = new Date('2026-06-07T00:00:00')

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

export default function CountdownDisplay() {
  const [time, setTime] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (time.expired) {
    return (
      <div className="text-center">
        <p className="text-4xl font-black text-red-600">Event Sedang Berlangsung! 🎌</p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 md:gap-8">
      <CountdownUnit value={time.days} label="Hari" />
      <Separator />
      <CountdownUnit value={time.hours} label="Jam" />
      <Separator />
      <CountdownUnit value={time.minutes} label="Menit" />
      <Separator />
      <CountdownUnit value={time.seconds} label="Detik" />
    </div>
  )
}

function Separator() {
  return (
    <div className="flex flex-col gap-3 mb-7">
      <div className="w-2 h-2 bg-red-600 rounded-full" />
      <div className="w-2 h-2 bg-red-600 rounded-full" />
    </div>
  )
}
