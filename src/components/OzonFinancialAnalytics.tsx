import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  RefreshCw,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Download
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { blink } from '../blink/client';

interface OzonSalesData {
  'ID начисления': string;
  'Дата начисления': string;
  'Группа услуг': string;
  'Тип начисления': string;
  'Артикул': string;
  'SKU': string;
  'Название товара': string;
  'Количество': number;
  'Цена продавца': number;
  'Дата принятия заказа в обработку или оказания услуги': string;
  'Схема работы': string;
  'Вознаграждение Ozon, %': number;
  'Индекс локализации, %': number;
  'Среднее время доставки, часы': number;
  'Сумма итого, руб': number;
  user_id: string;
}

interface FinancialMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  totalCommission: number;
  netProfit: number;
  returnRate: number;
  conversionRate: number;
  averageDeliveryTime: number;
  topProducts: Array<{
    name: string;
    revenue: number;
    quantity: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  schemePerformance: Array<{
    scheme: string;
    revenue: number;
    orders: number;
    avgDelivery: number;
  }>;
}

const COLORS = ['#005BFF', '#FF6B35', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function OzonFinancialAnalytics() {
  const [salesData, setSalesData] = useState<OzonSalesData[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const calculateMetrics = (data: OzonSalesData[]) => {
    if (!data.length) return;

    // Filter sales only (exclude returns, ads, logistics costs)
    const sales = data.filter(item => item['Тип начисления'] === 'Продажа');
    const returns = data.filter(item => item['Тип начисления'] === 'Возврат');
    const costs = data.filter(item => 
      item['Группа услуг'] === 'Маркетинг' || 
      item['Группа услуг'] === 'Логистика'
    );

    // Basic metrics
    const totalRevenue = sales.reduce((sum, item) => sum + item['Сумма итого, руб'], 0);
    const totalReturns = Math.abs(returns.reduce((sum, item) => sum + item['Сумма итого, руб'], 0));
    const totalCosts = Math.abs(costs.reduce((sum, item) => sum + item['Сумма итого, руб'], 0));
    const totalOrders = sales.length;
    const totalProducts = sales.reduce((sum, item) => sum + item['Количество'], 0);
    const averageOrderValue = totalRevenue / totalOrders || 0;
    
    // Commission calculation
    const totalCommission = sales.reduce((sum, item) => {
      const commission = (item['Цена продавца'] * item['Количество'] * item['Вознаграждение Ozon, %']) / 100;
      return sum + commission;
    }, 0);

    const netProfit = totalRevenue - totalCommission - totalCosts - totalReturns;
    const returnRate = (returns.length / sales.length) * 100 || 0;
    const averageDeliveryTime = sales.reduce((sum, item) => sum + item['Среднее время доставки, часы'], 0) / sales.length || 0;

    // Top products
    const productRevenue = new Map<string, { revenue: number; quantity: number }>();
    sales.forEach(item => {
      const existing = productRevenue.get(item['Название товара']) || { revenue: 0, quantity: 0 };
      productRevenue.set(item['Название товара'], {
        revenue: existing.revenue + item['Сумма итого, руб'],
        quantity: existing.quantity + item['Количество']
      });
    });

    const topProducts = Array.from(productRevenue.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Revenue by service group
    const categoryRevenue = new Map<string, number>();
    data.forEach(item => {
      const existing = categoryRevenue.get(item['Группа услуг']) || 0;
      categoryRevenue.set(item['Группа услуг'], existing + item['Сумма итого, руб']);
    });

    const totalCategoryRevenue = Array.from(categoryRevenue.values()).reduce((sum, val) => sum + Math.abs(val), 0);
    const revenueByCategory = Array.from(categoryRevenue.entries())
      .map(([category, revenue]) => ({
        category,
        revenue: Math.abs(revenue),
        percentage: (Math.abs(revenue) / totalCategoryRevenue) * 100
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Daily revenue trend
    const dailyData = new Map<string, { revenue: number; orders: number }>();
    sales.forEach(item => {
      const date = item['Дата начисления'];
      const existing = dailyData.get(date) || { revenue: 0, orders: 0 };
      dailyData.set(date, {
        revenue: existing.revenue + item['Сумма итого, руб'],
        orders: existing.orders + 1
      });
    });

    const dailyRevenue = Array.from(dailyData.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Scheme performance
    const schemeData = new Map<string, { revenue: number; orders: number; totalDelivery: number }>();
    sales.forEach(item => {
      const scheme = item['Схема работы'];
      const existing = schemeData.get(scheme) || { revenue: 0, orders: 0, totalDelivery: 0 };
      schemeData.set(scheme, {
        revenue: existing.revenue + item['Сумма итого, руб'],
        orders: existing.orders + 1,
        totalDelivery: existing.totalDelivery + item['Среднее время доставки, часы']
      });
    });

    const schemePerformance = Array.from(schemeData.entries())
      .map(([scheme, data]) => ({
        scheme,
        revenue: data.revenue,
        orders: data.orders,
        avgDelivery: data.totalDelivery / data.orders
      }))
      .sort((a, b) => b.revenue - a.revenue);

    setMetrics({
      totalRevenue,
      totalOrders,
      totalProducts,
      averageOrderValue,
      totalCommission,
      netProfit,
      returnRate,
      conversionRate: 85.2, // Mock conversion rate
      averageDeliveryTime,
      topProducts,
      revenueByCategory,
      dailyRevenue,
      schemePerformance
    });
  };

  const loadSalesData = async () => {
    try {
      setLoading(true);
      const currentUser = await blink.auth.me();
      
      const data = await blink.db.ozon_sales.list({
        where: { user_id: currentUser.id },
        orderBy: { 'Дата начисления': 'desc' }
      });

      setSalesData(data);
      calculateMetrics(data);
    } catch (error) {
      console.error('Error loading sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user);
      if (state.user && !state.isLoading) {
        loadSalesData();
      }
    });
    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Загрузка данных Ozon...</span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Нет данных для анализа</h3>
        <p className="text-gray-600">Загрузите данные продаж Ozon для начала анализа</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Финансовая аналитика Ozon</h1>
          <p className="text-gray-600 mt-1">Комплексный анализ продаж и прибыльности</p>
        </div>
        <Button onClick={loadSalesData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Обновить данные
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.totalRevenue)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Средний чек: {formatCurrency(metrics.averageOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Чистая прибыль</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(metrics.netProfit)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Маржа: {formatPercent((metrics.netProfit / metrics.totalRevenue) * 100)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заказы</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metrics.totalOrders}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Товаров: {metrics.totalProducts} шт.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Комиссия Ozon</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(metrics.totalCommission)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {formatPercent((metrics.totalCommission / metrics.totalRevenue) * 100)} от выручки
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Процент возвратов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Progress value={metrics.returnRate} className="flex-1" />
              <span className="text-sm font-medium">{formatPercent(metrics.returnRate)}</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {metrics.returnRate < 5 ? 'Отличный показатель' : 
               metrics.returnRate < 10 ? 'Хороший показатель' : 'Требует внимания'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Среднее время доставки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageDeliveryTime.toFixed(1)} ч
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {metrics.averageDeliveryTime < 24 ? 'Быстрая доставка' : 
               metrics.averageDeliveryTime < 48 ? 'Стандартная доставка' : 'Медленная доставка'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Конверсия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercent(metrics.conversionRate)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Высокий показатель конверсии
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Выручка</TabsTrigger>
          <TabsTrigger value="products">Товары</TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="schemes">Схемы работы</TabsTrigger>
          <TabsTrigger value="transactions">Транзакции</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Динамика выручки по дням</CardTitle>
              <CardDescription>Тренд продаж за период</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}к`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Выручка']}
                    labelFormatter={(label) => `Дата: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#005BFF" 
                    fill="#005BFF" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Топ-5 товаров по выручке</CardTitle>
              <CardDescription>Самые прибыльные товары</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.quantity} шт. продано</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Распределение выручки по группам услуг</CardTitle>
              <CardDescription>Структура доходов и расходов</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={metrics.revenueByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="revenue"
                    label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                  >
                    {metrics.revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schemes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Эффективность схем работы</CardTitle>
              <CardDescription>Сравнение FBO и FBS</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.schemePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scheme" />
                  <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 1000).toFixed(0)}к`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}ч`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'revenue') return [formatCurrency(value), 'Выручка'];
                      if (name === 'orders') return [value, 'Заказы'];
                      if (name === 'avgDelivery') return [`${value.toFixed(1)}ч`, 'Среднее время доставки'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#005BFF" name="revenue" />
                  <Bar yAxisId="right" dataKey="avgDelivery" fill="#FF6B35" name="avgDelivery" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Все транзакции</CardTitle>
                <CardDescription>
                  Полная история операций с Ozon
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Товар</TableHead>
                      <TableHead>Кол-во</TableHead>
                      <TableHead>Схема</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.slice(0, 10).map((item) => (
                      <TableRow key={item['ID начисления']}>
                        <TableCell className="font-medium">
                          {new Date(item['Дата начисления']).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={item['Тип начисления'] === 'Продажа' ? 'default' : 
                                   item['Тип начисления'] === 'Возврат' ? 'destructive' : 'secondary'}
                          >
                            {item['Тип начисления']}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {item['Название товара']}
                        </TableCell>
                        <TableCell>{item['Количество']}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item['Схема работы']}</Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${
                          item['Сумма итого, руб'] >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(item['Сумма итого, руб'])}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {salesData.length > 10 && (
                <div className="text-center mt-4">
                  <Button variant="outline">
                    Показать еще ({salesData.length - 10} записей)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Сводная статистика</CardTitle>
          <CardDescription>Ключевые показатели эффективности</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Всего транзакций</p>
              <p className="text-2xl font-bold text-blue-600">{salesData.length}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">ROI</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPercent((metrics.netProfit / (metrics.totalRevenue - metrics.netProfit)) * 100)}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Уникальных товаров</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.topProducts.length}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Средняя комиссия</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatPercent((metrics.totalCommission / metrics.totalRevenue) * 100)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}