import { Search, MapPin } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Pretraži usluge, salone, lokacije...',
  className = '',
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zoyya-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zoyya-100 bg-zoyya-50/50 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-zoyya-300 focus:bg-white focus:ring-2 focus:ring-zoyya-100"
      />
    </div>
  )
}

export function CitySelector({ compact = false }: { compact?: boolean }) {
  return (
    <button
      type="button"
      className={`flex items-center gap-1.5 rounded-lg border border-zoyya-100 bg-white text-sm font-medium text-gray-700 transition hover:border-zoyya-200 hover:bg-zoyya-50 ${
        compact ? 'px-2.5 py-1.5' : 'px-3 py-2'
      }`}
    >
      <MapPin className="h-4 w-4 text-zoyya-500" />
      <span>Zagreb</span>
    </button>
  )
}
