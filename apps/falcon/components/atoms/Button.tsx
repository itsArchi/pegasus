import type { ButtonProps } from '@/types'

const variants = {
  primary: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30',
  secondary: 'bg-white border-2 border-red-600 text-red-600 hover:bg-red-50',
  accent: 'bg-white text-red-600 hover:bg-red-600 hover:text-white border border-red-200 shadow-sm',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
