import React, { useState } from 'react'
import { OzonFinancialAnalytics } from '@/components/OzonFinancialAnalytics'
import { OzonDataUpload } from '@/components/OzonDataUpload'

export default function DashboardOverview() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleDataUploaded = () => {
    // Force refresh of analytics component
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Панель управления Ozon</h2>
          <p className="text-muted-foreground">
            Основные показатели эффективности вашего бизнеса на Ozon
          </p>
        </div>
      </div>

      <OzonDataUpload onDataUploaded={handleDataUploaded} />
      
      <OzonFinancialAnalytics key={refreshKey} />
    </div>
  )
}