import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarDays, Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, AlertTriangle, Clock, Percent } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import FileUpload from '@/components/FileUpload'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

// Mock data for charts
const revenueData = [
  { month: 'Янв', revenue: 2400000, orders: 1200, profit: 480000, expenses: 360000 },
  { month: 'Фев', revenue: 1398000, orders: 980, profit: 279600, expenses: 209700 },
  { month: 'Мар', revenue: 9800000, orders: 2100, profit: 1960000, expenses: 1470000 },
  { month: 'Апр', revenue: 3908000, orders: 1800, profit: 781600, expenses: 586200 },
  { month: 'Май', revenue: 4800000, orders: 2400, profit: 960000, expenses: 720000 },
  { month: 'Июн', revenue: 3800000, orders: 1900, profit: 760000, expenses: 570000 },
]

const categoryData = [
  { name: 'Электроника', value: 35, color: '#005BFF' },
  { name: 'Одежда', value: 25, color: '#FF6B35' },
  { name: 'Дом и сад', value: 20, color: '#10B981' },
  { name: 'Спорт', value: 12, color: '#8B5CF6' },
  { name: 'Прочее', value: 8, color: '#F59E0B' },
]

const expensesData = [
  { name: 'Комиссия Ozon', value: 45, color: '#EF4444' },
  { name: 'Логистика', value: 25, color: '#F97316' },
  { name: 'Реклама', value: 15, color: '#EAB308' },
  { name: 'Упаковка', value: 10, color: '#84CC16' },
  { name: 'Прочее', value: 5, color: '#6B7280' },
]

const topProducts = [
  { name: 'iPhone 15 Pro', sales: 1250000, units: 125, trend: 'up', margin: 18.5, commission: 15 },
  { name: 'Samsung Galaxy S24', sales: 980000, units: 98, trend: 'up', margin: 22.3, commission: 12 },
  { name: 'MacBook Air M3', sales: 2100000, units: 35, trend: 'down', margin: 15.8, commission: 18 },
  { name: 'AirPods Pro', sales: 450000, units: 180, trend: 'up', margin: 28.7, commission: 10 },
  { name: 'iPad Air', sales: 720000, units: 60, trend: 'up', margin: 20.1, commission: 14 },
]

const alertsData = [
  { type: 'warning', message: 'Высокая комиссия (>20%) у 3 товаров', count: 3 },
  { type: 'info', message: 'Медленная доставка (>5 дней) у 2 товаров', count: 2 },
  { type: 'success', message: 'Низкая маржа (<10%) у 1 товара', count: 1 },
]

const profitMarginData = [
  { range: '0-5%', count: 12, color: '#EF4444' },
  { range: '5-10%', count: 28, color: '#F97316' },
  { range: '10-15%', count: 45, color: '#EAB308' },
  { range: '15-20%', count: 38, color: '#84CC16' },
  { range: '20%+', count: 22, color: '#22C55E' },
]

export default function DashboardOverview() {
  const [uploadedData, setUploadedData] = useState<any[] | null>(null)
  const [dateRange, setDateRange] = useState('30')
  const [showUpload, setShowUpload] = useState(true)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const handleFileProcessed = (data: any[]) => {
    setUploadedData(data)
    setShowUpload(false)
  }

  const calculateKPIs = () => {
    if (!uploadedData) {
      return {
        totalRevenue: 25106000,
        totalOrders: 10400,
        totalProfit: 5021200,
        totalProducts: 2847,
        avgSellingPrice: 2413,
        profitMargin: 20.0,
        ozonCommission: 3766500
      }
    }

    const totalRevenue = uploadedData.reduce((sum, item) => sum + (item['Сумма итого, руб'] || 0), 0)
    const totalOrders = uploadedData.length
    const totalQuantity = uploadedData.reduce((sum, item) => sum + (item['Количество'] || 0), 0)
    const avgSellingPrice = totalRevenue / totalQuantity
    const totalCommission = uploadedData.reduce((sum, item) => {
      const revenue = item['Сумма итого, руб'] || 0
      const commissionRate = item['Вознаграждение Ozon, %'] || 0
      return sum + (revenue * commissionRate / 100)
    }, 0)
    const totalProfit = totalRevenue - totalCommission
    const profitMargin = (totalProfit / totalRevenue) * 100

    return {
      totalRevenue,
      totalOrders,
      totalProfit,
      totalProducts: new Set(uploadedData.map(item => item['Артикул'])).size,
      avgSellingPrice,
      profitMargin,
      ozonCommission: totalCommission
    }
  }

  const kpis = calculateKPIs()

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Панель управления Ozon</h2>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Последние 7 дней</SelectItem>
              <SelectItem value="30">Последние 30 дней</SelectItem>
              <SelectItem value="90">Последние 3 месяца</SelectItem>
              <SelectItem value="365">Последний год</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт в Excel
          </Button>
        </div>
      </div>

      {/* File Upload Section */}
      {showUpload && (
        <FileUpload onFileProcessed={handleFileProcessed} />
      )}

      {/* Smart Alerts */}
      {!showUpload && (
        <div className="grid gap-4 md:grid-cols-3">
          {alertsData.map((alert, index) => (
            <Alert key={index} variant={alert.type === 'warning' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Enhanced KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.totalRevenue)}</div>
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
            <div className="text-2xl font-bold">{kpis.totalOrders.toLocaleString('ru-RU')}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +15.3% от прошлого месяца
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Чистая прибыль</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.totalProfit)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Percent className="mr-1 h-3 w-3 text-blue-500" />
              Маржа: {kpis.profitMargin.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Комиссия Ozon</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.ozonCommission)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3 text-orange-500" />
              Средняя цена: {formatCurrency(kpis.avgSellingPrice)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional KPI Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средняя цена продажи</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.avgSellingPrice)}</div>
            <p className="text-xs text-muted-foreground">
              Выручка / Количество товаров
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Маржинальность</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              (Прибыль / Выручка) × 100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Уникальные товары</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalProducts.toLocaleString('ru-RU')}</div>
            <p className="text-xs text-muted-foreground">
              Количество уникальных SKU
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts Section with Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="profit">Прибыль</TabsTrigger>
          <TabsTrigger value="expenses">Расходы</TabsTrigger>
          <TabsTrigger value="margins">Маржинальность</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="profit" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Выручка vs Прибыль</CardTitle>
                <CardDescription>
                  Сравнение выручки, расходов и чистой прибыли по месяцам
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stackId="1"
                      stroke="#005BFF" 
                      fill="#005BFF"
                      fillOpacity={0.6}
                      name="Выручка"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stackId="2"
                      stroke="#EF4444" 
                      fill="#EF4444"
                      fillOpacity={0.6}
                      name="Расходы"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="profit" 
                      stackId="3"
                      stroke="#22C55E" 
                      fill="#22C55E"
                      fillOpacity={0.6}
                      name="Прибыль"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Структура расходов</CardTitle>
                <CardDescription>
                  Распределение расходов по типам услуг
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={expensesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expensesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Доля']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {expensesData.map((item) => (
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

            <Card>
              <CardHeader>
                <CardTitle>Тренд комиссий Ozon</CardTitle>
                <CardDescription>
                  Динамика комиссионных расходов по месяцам
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueData.map(item => ({ 
                    month: item.month, 
                    commission: item.revenue * 0.15 
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line 
                      type="monotone" 
                      dataKey="commission" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      dot={{ fill: '#EF4444' }}
                      name="Комиссия"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="margins" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Распределение маржинальности</CardTitle>
                <CardDescription>
                  Количество товаров по диапазонам маржинальности
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={profitMarginData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Количество товаров">
                      {profitMarginData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Enhanced Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Топ товары по выручке</CardTitle>
          <CardDescription>
            Самые продаваемые товары с детальной аналитикой
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium leading-none">{product.name}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span>{product.units} шт.</span>
                      <span>•</span>
                      <span>Маржа: {product.margin}%</span>
                      <span>•</span>
                      <span>Комиссия: {product.commission}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.sales)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.sales / product.units)} за шт.
                    </p>
                  </div>
                  <Badge 
                    variant={product.trend === 'up' ? 'default' : 'secondary'}
                    className={product.margin < 10 ? 'bg-red-100 text-red-800' : ''}
                  >
                    {product.trend === 'up' ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {product.trend === 'up' ? 'Рост' : 'Спад'}
                  </Badge>
                  {product.margin < 10 && (
                    <Badge variant="destructive">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Низкая маржа
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Processing Status */}
      {uploadedData && (
        <Card>
          <CardHeader>
            <CardTitle>Статус обработки данных</CardTitle>
            <CardDescription>
              Информация о загруженном файле и обработанных данных
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Записей обработано: {uploadedData.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm">Уникальных SKU: {new Set(uploadedData.map(item => item['Артикул'])).size}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-sm">Период: {uploadedData[0]?.['Дата']} - {uploadedData[uploadedData.length - 1]?.['Дата']}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowUpload(true)}
                >
                  Загрузить новый файл
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}