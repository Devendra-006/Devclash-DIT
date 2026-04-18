import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuditPage from './pages/AuditPage'
import ArchGraphPage from './pages/ArchGraphPage'
import CareerReportPage from './pages/CareerReportPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/audit/:auditId" element={<AuditPage />} />
        <Route path="/arch/:auditId" element={<ArchGraphPage />} />
        <Route path="/report/:auditId" element={<CareerReportPage />} />
      </Routes>
    </BrowserRouter>
  )
}