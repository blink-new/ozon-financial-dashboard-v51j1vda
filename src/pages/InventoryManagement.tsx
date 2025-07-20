import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Filter, Download, AlertTriangle, Package, TrendingUp } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const inventoryData = [
  { 
    id: 1, 
    name: 'iPhone 15 Pro 128GB', 
    sku: 'IPH15P-128-BLU', 
    category: 'Электроника', 
    stock: 45, 
    reserved: 12, 
    available: 33,
    reorderPoint: 20,
    cost: 85000,
    turnover: 8.5,
    status: 'normal'
  },
  { 
    id: 2, 
    name: 'Samsung Galaxy S24 Ultra', 
    sku: 'SAM-S24U-256-BLK', 
    category: 'Электроника', 
    stock: 23, 
    reserved: 8, 
    available: 15,
    reorderPoint: 25,
    cost: 95000,
    turnover: 6.2,
    status: 'low'
  },
  { 
    id: 3, 
    name: 'MacBook Air M3 13"', 
    sku: 'MBA-M3-13-SLV', 
    category: 'Электроника', 
    stock: 12, 
    reserved: 3, 
    available: 9,
    reorderPoint: 15,
    cost: 120000,
    turnover: 4.1,
    status: 'critical'
  },
  { 
    id: 4, 
    name: 'AirPods Pro 2-го поколения', 
    sku: 'APP-2GEN-WHT', 
    category: 'Электроника', 
    stock: 67, 
    reserved: 15, 
    available: 52,
    reorderPoint: 30,
    cost: 18000,
    turnover: 12.3,
    status: 'normal'
  },
  { 
    id: 5, 
    name: 'Кроссовки Nike Air Max', 
    sku: 'NIK-AM-42-BLK', 
    category: 'Спорт', 
    stock: 156, 
    reserved: 23, 
    available: 133,
    reorderPoint: 50,
    cost: 8500,
    turnover: 15.7,
    status: 'overstocked'
  },
]

const turnoverData = [
  { month: 'Янв', turnover: 8.2 },
  { month: 'Фев', turnover: 7.8 },
  { month: 'Мар', turnover: 9.1 },
  { month: 'Апр', turnover: 8.7 },
  { month: 'Май', turnover: 9.5 },
  { month: 'Июн', turnover: 8.9 },
]

const warehouseData = [
  { warehouse: 'Москва (основной)', items: 1250, value: 45000000, utilization: 78 },
  { warehouse: 'СПб (филиал)', items: 890, value: 32000000, utilization: 65 },
  { warehouse: 'Екатеринбург', items: 567, value: 18000000, utilization: 45 },
  { warehouse: 'Новосибирск', items: 340, value: 12000000, utilization: 38 },
]

export default function InventoryManagement() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive">Критический</Badge>
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-800">Мало</Badge>
      case 'normal':
        return <Badge className="bg-green-100 text-green-800">Норма</Badge>
      case 'overstocked':
        return <Badge className="bg-blue-100 text-blue-800">Избыток</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === 'critical' || status === 'low') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
    return null
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Управление складом</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Фильтры
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Отчет по складу
          </Button>
        </div>
      </div>

      {/* Inventory KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Общая стоимость</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(107000000)}</div>
            <p className="text-xs text-muted-foreground">+5.2% от прошлого месяца</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Оборачиваемость</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.9</div>
            <p className="text-xs text-muted-foreground">раз в год</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Критические остатки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-muted-foreground">товара требуют пополнения</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Заполненность складов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">средняя загрузка</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Turnover Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Оборачиваемость склада</CardTitle>
            <CardDescription>
              Динамика оборачиваемости товарных запасов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Оборачиваемость']} />
                <Line 
                  type="monotone" 
                  dataKey="turnover" 
                  stroke="#005BFF" 
                  strokeWidth={3}
                  dot={{ fill: '#005BFF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Warehouse Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Загрузка складов</CardTitle>
            <CardDescription>
              Использование складских помещений по регионам
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouseData.map((warehouse) => (
                <div key={warehouse.warehouse} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{warehouse.warehouse}</span>
                    <span>{warehouse.utilization}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${warehouse.utilization}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{warehouse.items} товаров</span>
                    <span>{formatCurrency(warehouse.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Остатки товаров</CardTitle>
          <CardDescription>
            Детальная информация о складских остатках
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск по названию или SKU..." className="pl-8" />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Товар</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Остаток</TableHead>
                <TableHead>Резерв</TableHead>
                <TableHead>Доступно</TableHead>
                <TableHead>Оборачиваемость</TableHead>
                <TableHead>Стоимость</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{item.stock}</div>
                      <div className="text-xs text-muted-foreground">
                        мин: {item.reorderPoint}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.reserved}</TableCell>
                  <TableCell className="font-medium">{item.available}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                      {item.turnover}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.cost)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}