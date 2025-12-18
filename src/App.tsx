import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Zones from './pages/Zones'
import ZoneForm from './pages/ZoneForm'
import ZoneDetail from './pages/ZoneDetail'
import ImportExport from './pages/ImportExport'
import Settings from './pages/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/zones" element={<Zones />} />
        <Route path="/zones/new" element={<ZoneForm />} />
        <Route path="/zones/:id" element={<ZoneDetail />} />
        <Route path="/import-export" element={<ImportExport />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
