import { HashRouter, Routes, Route } from 'react-router-dom'
import Cursor from './components/Cursor'
import HomePage from './pages/HomePage'
import CelestialPage from './pages/CelestialPage'
import BrandingPage from './pages/BrandingPage'
import LabsPage from './pages/LabsPage'
import PortfolioPage from './pages/PortfolioPage'
import './index.css'

export default function App() {
  return (
    <HashRouter>
      <Cursor />
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/celestial"  element={<CelestialPage />} />
        <Route path="/branding"   element={<BrandingPage />} />
        <Route path="/labs"       element={<LabsPage />} />
        <Route path="/portfolio"  element={<PortfolioPage />} />
        <Route path="*"           element={<HomePage />} />
      </Routes>
    </HashRouter>
  )
}
