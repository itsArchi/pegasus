'use client'

import { useRef, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShoppingBag, Ticket, Utensils, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import SectionTitle from '@/components/atoms/SectionTitle'
import ProductCard from '@/components/molecules/ProductCard'
import GET_CAMPAIGNS from '@/graphql/gql/queries/getCampaigns.gql'
import type { GetCampaignsQuery } from '@/graphql/gql/generated'

gsap.registerPlugin(ScrollTrigger)

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1573588506511-9f93976646cc?q=80&w=1974&auto=format&fit=crop'
const ICONS = [ShoppingBag, Ticket, Utensils, Package]
const PER_PAGE = 3

export default function ProductSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [page, setPage] = useState(1)

  const { data, loading, error } = useQuery<GetCampaignsQuery>(GET_CAMPAIGNS, {
    fetchPolicy: 'cache-and-network',
  })

  const campaigns = data?.campaigns.data ?? []
  const totalPages = Math.max(1, Math.ceil(campaigns.length / PER_PAGE))
  const start = (page - 1) * PER_PAGE
  const paginated = campaigns.slice(start, start + PER_PAGE)

  function goTo(p: number) {
    setPage(p)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useGSAP(
    () => {
      gsap.set('.reveal-section-products', { opacity: 0, y: 40 })
      gsap.set('.product-card', { opacity: 0, y: 80 })

      gsap.to('.reveal-section-products', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
      })
      gsap.to('.product-card', {
        scrollTrigger: { trigger: '.product-grid', start: 'top 80%' },
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: 'expo.out',
      })
    },
    { scope: sectionRef, dependencies: [campaigns.length] }
  )

  return (
    <section id="products" ref={sectionRef} className="py-40 bg-gray-50 relative overflow-hidden">
      <div className="absolute -bottom-20 -left-20 text-[20rem] font-black text-gray-200/40 select-none pointer-events-none uppercase leading-none">
        Japan
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle
          id="products"
          title="Tiket & Layanan Eksklusif"
          subtitle="Segalanya telah kami persiapkan untuk memastikan kunjungan Anda menjadi kenangan terindah."
        />

        {loading && !data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 product-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="product-card animate-pulse">
                <div className="bg-gray-200 rounded-4xl h-96" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-gray-400 py-16">Gagal memuat data campaign.</p>
        )}

        {!loading && !error && campaigns.length === 0 && (
          <p className="text-center text-gray-400 py-16">Belum ada campaign yang tersedia saat ini.</p>
        )}

        {paginated.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 product-grid">
              {paginated.map((c, i) => (
                <div key={c.id} className="product-card">
                  <ProductCard
                    title={c.name}
                    description={c.description ?? undefined}
                    slug={c.slug}
                    image={c.image_url ?? FALLBACK_IMAGE}
                    icon={ICONS[(start + i) % ICONS.length]}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-16">
              {totalPages > 1 && (
                <>
                  <button
                    onClick={() => goTo(page - 1)}
                    disabled={page === 1}
                    className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-600 hover:text-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goTo(p)}
                      className={`w-11 h-11 rounded-full text-sm font-black transition-all ${
                        p === page
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-110'
                          : 'border-2 border-gray-200 text-gray-400 hover:border-red-600 hover:text-red-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => goTo(page + 1)}
                    disabled={page === totalPages}
                    className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-600 hover:text-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              <span className={`text-xs font-black text-gray-400 uppercase tracking-widest ${totalPages > 1 ? 'ml-2' : ''}`}>
                {start + 1}–{Math.min(start + PER_PAGE, campaigns.length)} dari {campaigns.length} event
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
