import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Filter, Download, TrendingUp, TrendingDown, Star } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const productData = [
  { 
    id: 1, 
    name: 'iPhone 15 Pro 128GB', 
    category: 'Электроника', 
    sales: 1250000, 
    units: 125, 
    rating: 4.8, 
    reviews: 342, 
    trend: 'up',
    margin: 18.5,
    stock: 45
  },
  { 
    id: 2, 
    name: 'Samsung Galaxy S24 Ultra', 
    category: 'Электроника', 
    sales: 980000, 
    units: 98, 
    rating: 4.6, 
    reviews: 287, 
    trend: 'up',
    margin: 16.2,
    stock: 23
  },
  { 
    id: 3, 
    name: 'MacBook Air M3 13"', 
    category: 'Электроника', 
    sales: 2100000, 
    units: 35, 
    rating: 4.9, 
    reviews: 156, 
    trend: 'down',
    margin: 22.1,
    stock: 12
  },
  { 
    id: 4, 
    name: 'AirPods Pro 2-го поколения', 
    category: 'Электроника', 
    sales: 450000, 
    units: 180, 
    rating: 4.7, 
    reviews: 523, 
    trend: 'up',
    margin: 28.3,
    stock: 67
  },
  { 
    id: 5, 
    name: 'Кроссовки Nike Air Max', 
    category: 'Спорт', 
    sales: 320000, 
    units: 89, 
    rating: 4.4, 
    reviews: 198, 
    trend: 'up',
    margin: 35.7,
    stock: 156
  },
]

const categoryPerformance = [
  { category: 'Электроника', sales: 4780000, units: 438, margin: 19.2 },
  { category: 'Одежда', sales: 2100000, units: 1250, margin: 42.1 },
  { category: 'Дом и сад', sales: 1800000, units: 890, margin: 38.5 },
  { category: 'Спорт', sales: 1200000, units: 567, margin: 33.8 },
  { category: 'Красота', sales: 980000, units: 445, margin: 45.2 },
]

export default function ProductPerformance() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getStockStatus = (stock: number) => {
    if (stock < 20) return <Badge variant="destructive">Мало</Badge>
    if (stock < 50) return <Badge className="bg-yellow-100 text-yellow-800">Средне</Badge>
    return <Badge className="bg-green-100 text-green-800">Достаточно</Badge>
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Товары</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Фильтры
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Product KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Всего товаров</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12 новых за неделю</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Средняя маржа</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.4%</div>
            <p className="text-xs text-muted-foreground">+2.1% от прошлого месяца</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Средний рейтинг</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              4.6
              <Star className="ml-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground">Из 2,847 отзывов</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Товары с низким остатком</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-muted-foreground">Требуют пополнения</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Производительность по категориям</CardTitle>
          <CardDescription>
            Продажи и маржинальность по основным категориям товаров
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'sales' ? formatCurrency(Number(value)) : `${value}%`,
                  name === 'sales' ? 'Продажи' : 'Маржа'
                ]}
              />
              <Bar yAxisId="left" dataKey="sales" fill="#005BFF" name="Продажи" />
              <Bar yAxisId="right" dataKey="margin" fill="#FF6B35" name="Маржа %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Product Search and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Топ товары</CardTitle>
          <CardDescription>
            Детальная информация о самых продаваемых товарах
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск товаров..." className="pl-8" />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Товар</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Продажи</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead>Рейтинг</TableHead>
                <TableHead>Маржа</TableHead>
                <TableHead>Остаток</TableHead>
                <TableHead>Тренд</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(product.sales)}
                  </TableCell>
                  <TableCell>{product.units} шт.</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {product.margin}%
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{product.stock}</span>
                      {getStockStatus(product.stock)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTrendIcon(product.trend)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}