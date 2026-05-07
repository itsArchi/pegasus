interface SectionTitleProps {
  title: string
  subtitle: string
  id: string
}

export default function SectionTitle({ title, subtitle, id }: SectionTitleProps) {
  return (
    <div className={`text-center mb-16 reveal-section-${id}`}>
      <h2 className="text-4xl md:text-6xl font-black text-red-600 mb-4 tracking-tighter">{title}</h2>
      <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full mb-6" />
      <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">{subtitle}</p>
    </div>
  )
}
