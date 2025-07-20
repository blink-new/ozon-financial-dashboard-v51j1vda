import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const profitData = [
  { month: 'Янв', revenue: 2400000, costs: 1800000, profit: 600000 },
  { month: 'Фев', revenue: 1398000, costs: 1100000, profit: 298000 },
  { month: 'Мар', revenue: 9800000, costs: 7200000, profit: 2600000 },
  { month: 'Апр', revenue: 3908000, costs: 2900000, profit: 1008000 },
  { month: 'Май', revenue: 4800000, costs: 3600000, profit: 1200000 },
  { month: 'Июн', revenue: 3800000, costs: 2850000, profit: 950000 },
]

const expenseData = [
  { category: 'Реклама', amount: 850000, percentage: 35 },
  { category: 'Логистика', amount: 600000, percentage: 25 },
  { category: 'Комиссия Ozon', amount: 480000, percentage: 20 },
  { category: 'Упаковка', amount: 240000, percentage: 10 },
  { category: 'Прочие расходы', amount: 240000, percentage: 10 },
]

const transactions = [
  { id: '001', date: '2024-01-15', type: 'Продажа', amount: 125000, status: 'Завершено' },
  { id: '002', date: '2024-01-15', type: 'Возврат', amount: -15000, status: 'Обработано' },
  { id: '003', date: '2024-01-14', type: 'Продажа', amount: 89000, status: 'Завершено' },
  { id: '004', date: '2024-01-14', type: 'Комиссия', amount: -12000, status: 'Списано' },
  { id: '005', date: '2024-01-13', type: 'Продажа', amount: 156000, status: 'Завершено' },
]

export default function FinancialReports() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Завершено':
        return <Badge className="bg-green-100 text-green-800">Завершено</Badge>
      case 'Обработано':
        return <Badge className="bg-blue-100 text-blue-800">Обработано</Badge>
      case 'Списано':
        return <Badge className="bg-red-100 text-red-800">Списано</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Финансовые отчеты</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <CalendarDays className="mr-2 h-4 w-4" />
            Период
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт P&L
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Валовая прибыль</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(6656000)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +12.5% от прошлого месяца
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Маржинальность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26.5%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +1.2% от прошлого месяца
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Операционные расходы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(2410000)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              -3.1% от прошлого месяца
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.4%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +2.8% от прошлого месяца
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit & Loss Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Отчет о прибылях и убытках</CardTitle>
          <CardDescription>
            Динамика выручки, расходов и прибыли за последние 6 месяцев
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Месяц: ${label}`}
              />
              <Bar dataKey="revenue" fill="#005BFF" name="Выручка" />
              <Bar dataKey="costs" fill="#FF6B35" name="Расходы" />
              <Bar dataKey="profit" fill="#10B981" name="Прибыль" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Структура расходов</CardTitle>
            <CardDescription>
              Распределение операционных расходов по категориям
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseData.map((expense) => (
                <div key={expense.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 text-sm font-medium">{expense.category}</div>
                    <div className="flex-1">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full transition-all duration-300"
                          style={{ width: `${expense.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="w-12 text-right font-medium">{expense.percentage}%</span>
                    <span className="w-20 text-right">{formatCurrency(expense.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Последние транзакции</CardTitle>
            <CardDescription>
              Недавние финансовые операции
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-sm">{transaction.date}</TableCell>
                    <TableCell className="text-sm">{transaction.type}</TableCell>
                    <TableCell className={`text-sm font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}