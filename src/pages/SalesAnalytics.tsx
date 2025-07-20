import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, Download, Filter } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'

const salesData = [
  { date: '01.01', sales: 4000, conversion: 2.4, visitors: 2400 },
  { date: '02.01', sales: 3000, conversion: 1.8, visitors: 1398 },
  { date: '03.01', sales: 2000, conversion: 3.2, visitors: 9800 },
  { date: '04.01', sales: 2780, conversion: 2.8, visitors: 3908 },
  { date: '05.01', sales: 1890, conversion: 1.9, visitors: 4800 },
  { date: '06.01', sales: 2390, conversion: 2.3, visitors: 3800 },
  { date: '07.01', sales: 3490, conversion: 3.4, visitors: 4300 },
]

const hourlyData = [
  { hour: '00:00', orders: 12 },
  { hour: '03:00', orders: 8 },
  { hour: '06:00', orders: 15 },
  { hour: '09:00', orders: 45 },
  { hour: '12:00', orders: 78 },
  { hour: '15:00', orders: 65 },
  { hour: '18:00', orders: 89 },
  { hour: '21:00', orders: 56 },
]

const channelData = [
  { channel: 'Органический поиск', sales: 4500000, percentage: 35 },
  { channel: 'Реклама Ozon', sales: 3200000, percentage: 25 },
  { channel: 'Социальные сети', sales: 2100000, percentage: 16 },
  { channel: 'Email маркетинг', sales: 1800000, percentage: 14 },
  { channel: 'Прямые переходы', sales: 1300000, percentage: 10 },
]

export default function SalesAnalytics() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Аналитика продаж</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Фильтры
          </Button>
          <Button variant="outline" size="sm">
            <CalendarDays className="mr-2 h-4 w-4" />
            Период
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(2415)}</div>
            <p className="text-xs text-muted-foreground">+8.2% от прошлой недели</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Конверсия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4%</div>
            <p className="text-xs text-muted-foreground">+0.3% от прошлой недели</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Возвраты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">-0.5% от прошлой недели</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Повторные покупки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.7%</div>
            <p className="text-xs text-muted-foreground">+2.1% от прошлой недели</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Продажи и конверсия</CardTitle>
            <CardDescription>
              Динамика продаж и конверсии за последнюю неделю
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' ? formatCurrency(Number(value)) : `${value}%`,
                    name === 'sales' ? 'Продажи' : 'Конверсия'
                  ]}
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#005BFF" 
                  fill="#005BFF"
                  fillOpacity={0.1}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="conversion" 
                  stroke="#FF6B35" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Заказы по часам</CardTitle>
            <CardDescription>
              Распределение заказов в течение дня
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Заказы']} />
                <Bar dataKey="orders" fill="#005BFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sales Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Каналы продаж</CardTitle>
          <CardDescription>
            Эффективность различных каналов привлечения клиентов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channelData.map((channel) => (
              <div key={channel.channel} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium">{channel.channel}</div>
                  <div className="flex-1">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${channel.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="w-12 text-right font-medium">{channel.percentage}%</span>
                  <span className="w-24 text-right">{formatCurrency(channel.sales)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}