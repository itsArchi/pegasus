import Button from '@/components/atoms/Button'

interface Product {
  id: number
  icon: string
  name: string
  price: string
  desc: string
  badge?: string
}

const products: Product[] = [
  {
    id: 1,
    icon: '👘',
    name: 'Sewa Yukata Premium',
    price: 'Rp 150.000',
    desc: 'Tampil autentik dengan yukata berkualitas tinggi pilihan berbagai motif tradisional Jepang. Termasuk aksesoris & panduan pemakaian.',
    badge: 'Terlaris',
  },
  {
    id: 2,
    icon: '🎆',
    name: 'Tiket VIP Kembang Api',
    price: 'Rp 350.000',
    desc: 'Nikmati pertunjukan hanabi spektakuler dari kursi terbaik dengan area eksklusif, minuman gratis, dan souvenir resmi event.',
    badge: 'Eksklusif',
  },
  {
    id: 3,
    icon: '🍜',
    name: 'Voucher Makanan Street Food',
    price: 'Rp 75.000',
    desc: 'Jelajahi cita rasa otentik Jepang: takoyaki, yakitori, ramen, dan banyak lagi dari 20+ tenant kuliner pilihan.',
  },
]

const badgeColors: Record<string, string> = {
  Terlaris: 'bg-[#e85d04] text-white',
  Eksklusif: 'bg-amber-500 text-black',
}

export default function ProductGrid() {
  return (
    <section className="bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#e85d04] text-sm font-semibold tracking-[0.3em] uppercase mb-3">
            Pilihan Terbaik
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Paket &amp; Tiket
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Lengkapi pengalaman festival Anda dengan paket-paket spesial yang kami siapkan.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="
                relative flex flex-col
                bg-zinc-900 border border-zinc-800 rounded-2xl p-8
                transition-all duration-300 ease-out
                hover:-translate-y-2 hover:border-[#e85d04]/50 hover:shadow-2xl hover:shadow-[#e85d04]/10
                group
              "
            >
              {/* Badge */}
              {product.badge && (
                <span
                  className={`absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full ${badgeColors[product.badge]}`}
                >
                  {product.badge}
                </span>
              )}

              {/* Icon */}
              <div className="text-5xl mb-6">{product.icon}</div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f48c06] transition-colors">
                {product.name}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                {product.desc}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-800">
                <span className="text-2xl font-black text-[#e85d04]">
                  {product.price}
                </span>
                <Button variant="accent" className="text-xs px-5 py-2">Pilih</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
