'use client'

import { useState } from 'react'
import { z } from 'zod'
import Button from '@/components/atoms/Button'

const schema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  noHp: z.string().min(10, 'Nomor HP minimal 10 digit'),
  paket: z.string().min(1, 'Pilih salah satu paket'),
})

type FormValues = z.infer<typeof schema>
type FormErrors = Partial<Record<keyof FormValues, string>>

const initialValues: FormValues = {
  nama: '',
  email: '',
  noHp: '',
  paket: '',
}

const paketOptions = [
  { value: 'yukata', label: 'Sewa Yukata Premium — Rp 150.000' },
  { value: 'vip', label: 'Tiket VIP Kembang Api — Rp 350.000' },
  { value: 'food', label: 'Voucher Makanan Street Food — Rp 75.000' },
]

const inputClass = `
  w-full bg-zinc-800 border border-zinc-700 rounded-xl
  px-4 py-3 text-white text-sm placeholder-zinc-500
  focus:outline-none focus:border-[#e85d04] focus:ring-1 focus:ring-[#e85d04]
  transition-colors duration-200
`

export default function RegistrationForm() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = schema.safeParse(values)

    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormValues
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    console.log('Form submitted:', result.data)
    setSubmitted(true)
    setValues(initialValues)
    setErrors({})
  }

  if (submitted) {
    return (
      <section className="bg-zinc-950 py-24 px-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Pendaftaran Berhasil!
          </h3>
          <p className="text-zinc-400 mb-8">
            Terima kasih telah mendaftar. Kami akan menghubungi Anda melalui email jika terpilih sebagai pemenang.
          </p>
          <Button
            variant="accent"
            onClick={() => setSubmitted(false)}
          >
            Daftar Lagi
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-zinc-950 py-24 px-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#e85d04] text-sm font-semibold tracking-[0.3em] uppercase mb-3">
            Gratis
          </p>
          <h2 className="text-4xl font-black text-white mb-4">
            Daftar untuk Undian
            <span className="block text-[#e85d04]">Tiket Gratis!</span>
          </h2>
          <p className="text-zinc-400 text-sm">
            Isi data di bawah dan dapatkan kesempatan memenangkan tiket gratis Tokyo Natsu Matsuri 2026.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={values.nama}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap Anda"
              className={inputClass}
            />
            {errors.nama && (
              <p className="mt-1.5 text-xs text-red-400">{errors.nama}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              className={inputClass}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* No HP */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Nomor HP
            </label>
            <input
              type="tel"
              name="noHp"
              value={values.noHp}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              className={inputClass}
            />
            {errors.noHp && (
              <p className="mt-1.5 text-xs text-red-400">{errors.noHp}</p>
            )}
          </div>

          {/* Paket */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Pilih Paket
            </label>
            <select
              name="paket"
              value={values.paket}
              onChange={handleChange}
              className={`${inputClass} appearance-none`}
            >
              <option value="" disabled>
                -- Pilih paket --
              </option>
              {paketOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.paket && (
              <p className="mt-1.5 text-xs text-red-400">{errors.paket}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
          >
            Ikut Undian Sekarang
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Dengan mendaftar, Anda menyetujui syarat &amp; ketentuan yang berlaku.
        </p>
      </div>
    </section>
  )
}
