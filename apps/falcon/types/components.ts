import type { LucideIcon } from 'lucide-react'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export interface SectionTitleProps {
  title: string
  subtitle: string
  id: string
}

export interface CountdownUnitProps {
  value: number
  label: string
}

export interface ProductCardProps {
  title: string
  description?: string
  slug: string
  image: string
  icon: LucideIcon
  tag?: string
}

export interface NavLink {
  label: string
  href: string
}
