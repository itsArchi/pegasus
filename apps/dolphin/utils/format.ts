export function formatDate(date: string | Date, locale = 'id-ID'): string {
  return new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateTime(date: string | Date, locale = 'id-ID'): string {
  return new Date(date).toLocaleString(locale, {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function getInitials(name: string): string {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

export function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
