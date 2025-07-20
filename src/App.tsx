import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DashboardOverview from '@/pages/DashboardOverview'
import SalesAnalytics from '@/pages/SalesAnalytics'
import FinancialReports from '@/pages/FinancialReports'
import ProductPerformance from '@/pages/ProductPerformance'
import InventoryManagement from '@/pages/InventoryManagement'

function App() {
  return (
    <Router>
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen bg-background font-sans antialiased">
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/sales" element={<SalesAnalytics />} />
              <Route path="/financial" element={<FinancialReports />} />
              <Route path="/products" element={<ProductPerformance />} />
              <Route path="/inventory" element={<InventoryManagement />} />
            </Routes>
          </DashboardLayout>
          <Toaster />
        </div>
      </SidebarProvider>
    </Router>
  )
}

export default App