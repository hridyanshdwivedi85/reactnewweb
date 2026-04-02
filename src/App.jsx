import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Cursor from './components/Cursor'
import HomePage from './pages/HomePage'
import CelestialPage from './pages/CelestialPage'
import BrandingPage from './pages/BrandingPage'
import LabsPage from './pages/LabsPage'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/celestial" element={<CelestialPage />} />
        <Route path="/branding" element={<BrandingPage />} />
        <Route path="/labs" element={<LabsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
