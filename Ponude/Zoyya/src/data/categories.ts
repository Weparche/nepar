import {
  Scissors,
  User,
  Sparkles,
  Hand,
  Droplets,
  Eye,
  Zap,
  Palette,
  Flower2,
} from 'lucide-react'
import type { Category, CategoryId } from '../types'

export const categories: Category[] = [
  { id: 'frizeri', label: 'Frizeri', icon: Scissors },
  { id: 'barberi', label: 'Barberi', icon: User },
  { id: 'nokti', label: 'Nokti', icon: Sparkles },
  { id: 'masaze', label: 'Masaže', icon: Hand },
  { id: 'skin-care', label: 'Skin care', icon: Droplets },
  { id: 'obrve', label: 'Obrve i trepavice', icon: Eye },
  { id: 'depilacija', label: 'Depilacija', icon: Zap },
  { id: 'make-up', label: 'Make up', icon: Palette },
  { id: 'wellness', label: 'Wellness & spa', icon: Flower2 },
]

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>

export const mobileCategories = categories.slice(0, 5)

export function getCategoryIcon(id: CategoryId) {
  return categoryMap[id]?.icon ?? Scissors
}
