export function formatCurrency(amount: number, locale = 'id-ID', currency = 'IDR'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount)
}

export function formatDate(date: string | Date, locale = 'id-ID'): string {
  return new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

export function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}
