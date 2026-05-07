interface CountdownUnitProps {
  value: number
  label: string
}

export default function CountdownUnit({ value, label }: CountdownUnitProps) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-28 h-28 md:w-40 md:h-40 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-red-600/10 border border-gray-100">
          <span className="text-5xl md:text-7xl font-black text-gray-900 tabular-nums tracking-tighter">
            {display}
          </span>
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 rounded-full" />
        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-red-600 rounded-full" />
      </div>
      <span className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">{label}</span>
    </div>
  )
}
