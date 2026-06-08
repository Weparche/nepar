import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { SearchResultsPage } from './pages/SearchResultsPage'
import { SalonProfilePage } from './pages/SalonProfilePage'
import { BusinessPage } from './pages/BusinessPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/saloni/:city" element={<SearchResultsPage />} />
      <Route path="/saloni/:city/:category" element={<SearchResultsPage />} />
      <Route path="/salon/:slug" element={<SalonProfilePage />} />
      <Route path="/za-salone" element={<BusinessPage />} />
    </Routes>
  )
}
