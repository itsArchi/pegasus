'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { X, CalendarDays, ArrowRight } from 'lucide-react'

interface ProductCardProps {
  title: string
  description?: string
  slug: string
  image: string
  icon: LucideIcon
  tag?: string
}

function Modal({
  open, onClose, title, description, slug, image, icon: Icon, tag,
}: ProductCardProps & { open: boolean; onClose: () => void }) {
  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/40 animate-in fade-in zoom-in-95 duration-200"
        style={{ width: '80vw', maxWidth: '900px', maxHeight: '85vh', display: 'grid', gridTemplateColumns: '360px 1fr' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kiri — Gambar */}
        <div className="relative overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)' }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
          >
            <X size={18} />
          </button>
          {tag && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
              {tag}
            </span>
          )}
          <div className="absolute bottom-6 left-5 flex items-center gap-3 text-white">
            <div className="p-2.5 bg-red-600 rounded-xl shadow-lg">
              <Icon size={20} />
            </div>
            <span className="font-black text-lg leading-tight">{title}</span>
          </div>
        </div>

        {/* Kanan — Konten */}
        <div className="flex flex-col justify-between overflow-y-auto p-8">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <CalendarDays size={14} className="text-red-600" />
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                Tokyo Natsu Matsuri 2026
              </span>
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-4 leading-snug">{title}</h2>

            {description ? (
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            ) : (
              <p className="text-gray-400 text-sm italic">Tidak ada deskripsi.</p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-gray-100">
            <Link
              href={`/campaign/${slug}`}
              onClick={onClose}
              className="w-full py-3 px-8 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700"
            >
              Bergabung ke Event <ArrowRight size={16} />
            </Link>
            <button
              onClick={onClose}
              className="w-full py-3 px-8 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-500 hover:border-gray-300"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function ProductCard({ title, description, slug, image, icon: Icon, tag }: ProductCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-4xl overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-3 transition-all duration-500 group">
        <div className="h-72 overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-t from-red-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {tag && (
            <span className="absolute top-6 left-6 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full z-20 shadow-lg">
              {tag}
            </span>
          )}
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <div className="p-2.5 bg-red-600 rounded-xl shadow-xl">
              <Icon size={24} />
            </div>
            <span className="font-bold text-lg">{title}</span>
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-gray-400 text-sm mb-6 line-clamp-2">{description}</p>
          )}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setOpen(true)}
              className="w-full py-3 px-8 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700"
            >
              Lihat Detail
            </button>
            <Link
              href={`/campaign/${slug}`}
              className="w-full py-3 px-8 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50"
            >
              Bergabung ke Event
            </Link>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
        slug={slug}
        image={image}
        icon={Icon}
        tag={tag}
      />
    </>
  )
}
