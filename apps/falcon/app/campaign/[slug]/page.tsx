'use client'

import { useState, use } from 'react'
import { useQuery } from '@apollo/client/react'
import { useMutation } from '@apollo/client/react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import GET_CAMPAIGN_BY_SLUG from '@/graphql/gql/queries/getCampaignBySlug.gql'
import SUBMIT_REGISTRATION from '@/graphql/gql/mutations/submitRegistration.gql'
import type {
  GetCampaignBySlugQuery,
  GetCampaignBySlugQueryVariables,
  SubmitRegistrationMutation,
  SubmitRegistrationMutationVariables,
} from '@/graphql/gql/generated'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1573588506511-9f93976646cc?q=80&w=1974&auto=format&fit=crop'

interface FormState {
  name: string
  email: string
  phone: string
}

const EMPTY: FormState = { name: '', email: '', phone: '' }

export default function CampaignDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  const { data, loading: queryLoading } = useQuery<GetCampaignBySlugQuery, GetCampaignBySlugQueryVariables>(
    GET_CAMPAIGN_BY_SLUG,
    { variables: { slug } },
  )

  const campaign = data?.campaignBySlug

  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)

  const [submitRegistration, { loading: submitting, error: mutationError }] = useMutation<
    SubmitRegistrationMutation,
    SubmitRegistrationMutationVariables
  >(SUBMIT_REGISTRATION, {
    onCompleted: (res) => {
      if (res.submitRegistration.success) setSubmitted(true)
    },
  })

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Nama minimal 2 karakter'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
    if (form.phone && !/^[0-9+\-\s()]{8,20}$/.test(form.phone)) e.phone = 'Format nomor HP tidak valid'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !campaign) return
    submitRegistration({
      variables: {
        input: {
          campaign_id: campaign.id,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
        },
      },
    })
  }

  if (queryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-gray-700">Campaign tidak ditemukan</p>
        <Link href="/" className="text-red-600 font-semibold hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-80 md:h-[420px] overflow-hidden">
        <img
          src={campaign.image_url ?? FALLBACK_IMAGE}
          alt={campaign.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0">
          <Link
            href="/"
            className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Kembali
          </Link>
        </div>
      </div>

      {/* Content + Form Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Left — title & description */}
          <div className="lg:w-1/2 lg:sticky lg:top-10">
            <p className="text-red-600 text-xs font-black uppercase tracking-[0.3em] mb-4">Detail Event</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tighter mb-6">
              {campaign.name}
            </h1>
            {campaign.description && (
              <p className="text-gray-500 text-lg leading-relaxed">{campaign.description}</p>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-10 text-sm text-gray-400 hover:text-red-600 font-semibold transition-colors"
            >
              <ArrowLeft size={14} /> Kembali ke Beranda
            </Link>
          </div>

          {/* Right — form */}
          <div className="lg:w-1/2 w-full">
        {submitted ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-800 mb-3">Pendaftaran Berhasil!</h2>
            <p className="text-gray-500 mb-8">
              Terima kasih <span className="font-semibold text-gray-700">{form.name}</span>! Kami akan segera menghubungi Anda di <span className="font-semibold text-gray-700">{form.email}</span>.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
            >
              <ArrowLeft size={16} /> Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h2 className="text-2xl font-black text-gray-800 mb-2">Daftar ke Event Ini</h2>
            <p className="text-gray-500 mb-8 text-sm">
              Isi formulir di bawah untuk bergabung ke <span className="font-semibold">{campaign.name}</span>.
            </p>

            {mutationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {mutationError.message}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  disabled={submitting}
                  className={`w-full px-4 py-3 rounded-xl border text-gray-800 bg-gray-50 outline-none transition-all focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:opacity-60 ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="nama@email.com"
                  disabled={submitting}
                  className={`w-full px-4 py-3 rounded-xl border text-gray-800 bg-gray-50 outline-none transition-all focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:opacity-60 ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor HP
                  <span className="text-gray-400 font-normal ml-1">(opsional)</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  disabled={submitting}
                  className={`w-full px-4 py-3 rounded-xl border text-gray-800 bg-gray-50 outline-none transition-all focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:opacity-60 ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-base"
              >
                {submitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  'Daftar Sekarang'
                )}
              </button>
            </form>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}
