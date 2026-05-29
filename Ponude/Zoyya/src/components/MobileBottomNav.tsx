import { Home, Search, Heart, Calendar, User } from 'lucide-react'

type NavItem = 'home' | 'search' | 'favorites' | 'appointments' | 'profile'

interface MobileBottomNavProps {
  active: NavItem
  onChange: (item: NavItem) => void
  favoriteCount: number
}

const items: { id: NavItem; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Početna', icon: Home },
  { id: 'search', label: 'Pretraga', icon: Search },
  { id: 'favorites', label: 'Favoriti', icon: Heart },
  { id: 'appointments', label: 'Moji termini', icon: Calendar },
  { id: 'profile', label: 'Profil', icon: User },
]

export default function MobileBottomNav({
  active,
  onChange,
  favoriteCount,
}: MobileBottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white px-2 pb-safe lg:hidden"
      data-testid="mobile-bottom-nav"
    >
      <div className="flex items-center justify-around py-2">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              data-testid={`nav-${id}`}
              onClick={() => onChange(id)}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1 ${
                isActive ? 'text-zoyya-600' : 'text-gray-400'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-medium">{label}</span>
              {id === 'favorites' && favoriteCount > 0 && (
                <span className="absolute -right-0.5 top-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zoyya-600 text-[8px] font-bold text-white">
                  {favoriteCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export type { NavItem }
