import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface FileUploadProps {
  onFileProcessed?: (data: any[]) => void
}

export default function FileUpload({ onFileProcessed }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [processedData, setProcessedData] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true)
    setUploadProgress(0)

    try {
      // Simulate file processing with progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate file parsing (in real app, you'd use a library like Papa Parse for CSV or SheetJS for Excel)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock processed data structure based on Ozon report format
      const mockData = [
        {
          'Дата': '2024-01-15',
          'Номер заказа': 'ORD-001',
          'Артикул': 'SKU-12345',
          'Название товара': 'iPhone 15 Pro 128GB',
          'Количество': 2,
          'Цена продавца': 89990,
          'Сумма итого, руб': 179980,
          'Вознаграждение Ozon, %': 15,
          'Тип начисления': 'Продажа',
          'Группа услуг': 'Комиссия за продажу',
          'Среднее время доставки': 3
        },
        {
          'Дата': '2024-01-16',
          'Номер заказа': 'ORD-002',
          'Артикул': 'SKU-67890',
          'Название товара': 'Samsung Galaxy S24',
          'Количество': 1,
          'Цена продавца': 79990,
          'Сумма итого, руб': 79990,
          'Вознаграждение Ozon, %': 12,
          'Тип начисления': 'Продажа',
          'Группа услуг': 'Комиссия за продажу',
          'Среднее время доставки': 2
        }
      ]

      setUploadProgress(100)
      setProcessedData(mockData)
      onFileProcessed?.(mockData)
      
    } catch (err) {
      setError('Ошибка при обработке файла. Проверьте формат данных.')
    } finally {
      setIsProcessing(false)
    }
  }, [onFileProcessed])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setError(null)
      processFile(file)
    }
  }, [processFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  })

  const removeFile = () => {
    setUploadedFile(null)
    setProcessedData(null)
    setUploadProgress(0)
    setError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Загрузка отчета Ozon
        </CardTitle>
        <CardDescription>
          Загрузите CSV или Excel файл с отчетом о продажах из личного кабинета Ozon
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Отпустите файл здесь' : 'Перетащите файл сюда'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              или нажмите для выбора файла
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">.csv</Badge>
              <Badge variant="secondary">.xlsx</Badge>
              <Badge variant="secondary">.xls</Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {processedData ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : isProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                ) : null}
                <Button variant="ghost" size="sm" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Обработка файла...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {processedData && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Файл успешно обработан! Найдено {processedData.length} записей.
                  Данные автоматически загружены в панель управления.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}