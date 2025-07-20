import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarDays, Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

// Mock data for charts
const revenueData = [
  { month: 'Янв', revenue: 2400000, orders: 1200 },
  { month: 'Фев', revenue: 1398000, orders: 980 },
  { month: 'Мар', revenue: 9800000, orders: 2100 },
  { month: 'Апр', revenue: 3908000, orders: 1800 },
  { month: 'Май', revenue: 4800000, orders: 2400 },
  { month: 'Июн', revenue: 3800000, orders: 1900 },
]

const categoryData = [
  { name: 'Электроника', value: 35, color: '#005BFF' },
  { name: 'Одежда', value: 25, color: '#FF6B35' },
  { name: 'Дом и сад', value: 20, color: '#10B981' },
  { name: 'Спорт', value: 12, color: '#8B5CF6' },
  { name: 'Прочее', value: 8, color: '#F59E0B' },
]

const topProducts = [
  { name: 'iPhone 15 Pro', sales: 1250000, units: 125, trend: 'up' },
  { name: 'Samsung Galaxy S24', sales: 980000, units: 98, trend: 'up' },
  { name: 'MacBook Air M3', sales: 2100000, units: 35, trend: 'down' },
  { name: 'AirPods Pro', sales: 450000, units: 180, trend: 'up' },
  { name: 'iPad Air', sales: 720000, units: 60, trend: 'up' },
]

export default function DashboardOverview() {
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
        <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <CalendarDays className="mr-2 h-4 w-4" />
            Последние 30 дней
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(25106000)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +20.1% от прошлого месяца
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заказы</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,400</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +15.3% от прошлого месяца
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Прибыль</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(5021200)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              -2.4% от прошлого месяца
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Товары</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +12 новых товаров
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Выручка и заказы</CardTitle>
            <CardDescription>
              Динамика выручки и количества заказов за последние 6 месяцев
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(Number(value)) : value,
                    name === 'revenue' ? 'Выручка' : 'Заказы'
                  ]}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#005BFF" 
                  strokeWidth={3}
                  dot={{ fill: '#005BFF' }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#FF6B35" 
                  strokeWidth={3}
                  dot={{ fill: '#FF6B35' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Продажи по категориям</CardTitle>
            <CardDescription>
              Распределение продаж по основным категориям товаров
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Доля']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="mr-2 h-3 w-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Топ товары</CardTitle>
          <CardDescription>
            Самые продаваемые товары за текущий месяц
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.units} шт.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{formatCurrency(product.sales)}</span>
                  <Badge variant={product.trend === 'up' ? 'default' : 'secondary'}>
                    {product.trend === 'up' ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {product.trend === 'up' ? 'Рост' : 'Спад'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}