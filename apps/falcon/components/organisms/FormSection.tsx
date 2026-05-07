'use client'

import { useRef, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send, Sparkles, CheckCircle } from 'lucide-react'
import Button from '@/components/atoms/Button'
import GET_CAMPAIGNS from '@/graphql/gql/queries/getCampaigns.gql'
import SUBMIT_REGISTRATION from '@/graphql/gql/mutations/submitRegistration.gql'
import type {
  GetCampaignsQuery,
  SubmitRegistrationMutation,
  SubmitRegistrationMutationVariables,
} from '@/graphql/gql/generated'
import type { RegistrationFormState as FormState } from '@/types'

gsap.registerPlugin(ScrollTrigger)

const inputClass =
  'w-full px-8 py-5 rounded-4xl bg-gray-50 border-2 border-gray-100 text-gray-900 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 transition-all font-bold text-lg disabled:opacity-50'

const EMPTY: FormState = { name: '', email: '', phone: '', campaign_id: '' }

export default function FormSection() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const formBoxRef = useRef<HTMLDivElement>(null)

  const { data: campaignData } = useQuery<GetCampaignsQuery>(GET_CAMPAIGNS, {
    fetchPolicy: 'cache-and-network',
  })
  const campaigns = campaignData?.campaigns.data ?? []

  const [submitRegistration, { loading: submitting, error: mutationError }] = useMutation<
    SubmitRegistrationMutation,
    SubmitRegistrationMutationVariables
  >(SUBMIT_REGISTRATION, {
    onCompleted: (res) => {
      if (res.submitRegistration.success) {
        setSubmittedName(form.name)
        setSubmitted(true)
        setForm(EMPTY)
        setErrors({})
      }
    },
  })

  useGSAP(
    () => {
      gsap.fromTo(
        formBoxRef.current,
        { y: 100, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1.5,
          },
          y: 0,
          opacity: 1,
          scale: 1,
          ease: 'power2.out',
        }
      )
    },
    { scope: sectionRef }
  )

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Nama minimal 2 karakter'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
    if (form.phone && !/^[0-9+\-\s()]{8,20}$/.test(form.phone)) e.phone = 'Format nomor HP tidak valid'
    if (!form.campaign_id) e.campaign_id = 'Pilih salah satu event'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return
    submitRegistration({
      variables: {
        input: {
          campaign_id: form.campaign_id,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
        },
      },
    })
  }

  return (
    <section id="daftar-undian" ref={sectionRef} className="py-40 bg-red-600 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-700 rounded-full blur-[120px] -ml-64 -mb-64 opacity-60" />

      <div className="container mx-auto px-6 relative z-10">
        <div
          ref={formBoxRef}
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20 bg-white p-10 md:p-20 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]"
        >
          {/* Left copy */}
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tighter">
              Daftar <span className="text-red-600">Undian</span> Tiket Gratis!
            </h2>
            <p className="text-gray-500 mb-10 text-xl font-medium leading-relaxed">
              Jadilah yang beruntung untuk mendapatkan akses penuh ke Tokyo Natsu Matsuri 2026.
              Keajaiban hanya selangkah lagi!
            </p>
            <div className="flex items-center gap-5 text-red-600 font-black text-lg bg-red-50 p-6 rounded-3xl border border-red-100">
              {/* <Sparkles size={32} /> */}
              <span>Sudah 5,000+ orang mendaftar!</span>
            </div>
          </div>

          {/* Right form */}
          <div className="w-full md:w-1/2">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-900 mb-3">Pendaftaran Berhasil!</h3>
                <p className="text-gray-500 mb-8">
                  Terima kasih <span className="font-semibold text-gray-800">{submittedName}</span>!
                  Cek email Anda untuk konfirmasi pendaftaran.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 rounded-full border-2 border-red-600 text-red-600 font-bold hover:bg-red-50 transition-colors"
                >
                  Daftar Lagi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">

                {/* Campaign select */}
                <div>
                  <label className="block text-sm font-black text-gray-700 ml-2 mb-2 uppercase tracking-widest">
                    Pilih Event
                  </label>
                  <select
                    value={form.campaign_id}
                    onChange={(e) => handleChange('campaign_id', e.target.value)}
                    disabled={submitting || campaigns.length === 0}
                    suppressHydrationWarning
                    className={`${inputClass} ${errors.campaign_id ? 'border-red-400 bg-red-50' : ''}`}
                  >
                    <option value="" suppressHydrationWarning>
                      {campaigns.length === 0 ? 'Belum ada event tersedia' : '— Pilih Event —'}
                    </option>
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.campaign_id && (
                    <p className="mt-1.5 text-xs text-red-500 ml-2">{errors.campaign_id}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-black text-gray-700 ml-2 mb-2 uppercase tracking-widest">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Contoh: Kenjiro-san"
                    disabled={submitting}
                    className={`${inputClass} ${errors.name ? 'border-red-400 bg-red-50' : ''}`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500 ml-2">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-black text-gray-700 ml-2 mb-2 uppercase tracking-widest">
                    Email Aktif
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="nama@matsuri.jp"
                    disabled={submitting}
                    className={`${inputClass} ${errors.email ? 'border-red-400 bg-red-50' : ''}`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500 ml-2">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-black text-gray-700 ml-2 mb-2 uppercase tracking-widest">
                    Nomor HP <span className="normal-case font-normal text-gray-400">(opsional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    disabled={submitting}
                    className={`${inputClass} ${errors.phone ? 'border-red-400 bg-red-50' : ''}`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-500 ml-2">{errors.phone}</p>
                  )}
                </div>

                {mutationError && (
                  <p className="text-sm text-red-600 bg-red-50 px-5 py-3 rounded-2xl border border-red-200">
                    {mutationError.message}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="w-full py-6 text-xl shadow-[0_20px_50px_rgba(220,38,38,0.3)]"
                >
                  {submitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    <>Kirim Sekarang <Send size={22} /></>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
