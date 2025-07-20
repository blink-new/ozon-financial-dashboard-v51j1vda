import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import { blink } from '@/blink/client'

interface OzonDataUploadProps {
  onDataUploaded?: () => void
}

export function OzonDataUpload({ onDataUploaded }: OzonDataUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    message: string
    recordsProcessed?: number
    duplicatesSkipped?: number
  } | null>(null)
  const [user, setUser] = useState<any>(null)

  React.useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    setProgress(0)
    setUploadResult(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      // Extract text from the uploaded file
      const extractedText = await blink.data.extractFromBlob(file)
      
      // Parse CSV data
      const lines = extractedText.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      let recordsProcessed = 0
      let duplicatesSkipped = 0

      // Process each line
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        
        if (values.length !== headers.length) continue

        const record: any = { user_id: user.id }
        
        // Map CSV columns to database fields
        headers.forEach((header, index) => {
          const value = values[index]
          
          // Handle numeric fields
          if (header.includes('Количество')) {
            record[header] = parseInt(value) || 0
          } else if (header.includes('Цена') || header.includes('Сумма') || header.includes('%') || header.includes('часы')) {
            record[header] = parseFloat(value) || 0
          } else {
            record[header] = value
          }
        })

        try {
          // Check for duplicates using unique constraint
          const existing = await blink.db.ozonSales.list({
            where: {
              AND: [
                { user_id: user.id },
                { 'ID начисления': record['ID начисления'] },
                { 'Тип начисления': record['Тип начисления'] }
              ]
            },
            limit: 1
          })

          if (existing.length === 0) {
            await blink.db.ozonSales.create(record)
            recordsProcessed++
          } else {
            duplicatesSkipped++
          }
        } catch (error) {
          console.error('Error inserting record:', error)
          duplicatesSkipped++
        }
      }

      clearInterval(progressInterval)
      setProgress(100)

      setUploadResult({
        success: true,
        message: 'Данные успешно загружены!',
        recordsProcessed,
        duplicatesSkipped
      })

      // Call callback to refresh analytics
      if (onDataUploaded) {
        onDataUploaded()
      }

    } catch (error) {
      console.error('Upload error:', error)
      setUploadResult({
        success: false,
        message: 'Ошибка при загрузке файла. Проверьте формат данных.'
      })
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }, [user, onDataUploaded])

  const clearResult = () => {
    setUploadResult(null)
    setProgress(0)
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Войдите в систему для загрузки данных</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Загрузка данных Ozon
        </CardTitle>
        <CardDescription>
          Загрузите CSV файл с отчетом о продажах из личного кабинета Ozon
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploading && !uploadResult && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Выберите CSV файл с данными Ozon</p>
              <p className="text-xs text-muted-foreground">
                Поддерживаются файлы с полями: ID начисления, Дата начисления, Группа услуг, и др.
              </p>
            </div>
            <div className="mt-4">
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Выбрать файл
                </label>
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium">Обработка файла...</p>
              <p className="text-xs text-muted-foreground">
                Пожалуйста, не закрывайте страницу
              </p>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-center text-muted-foreground">
              {progress}% завершено
            </p>
          </div>
        )}

        {uploadResult && (
          <Alert variant={uploadResult.success ? 'default' : 'destructive'}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                {uploadResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div>
                  <AlertDescription>
                    {uploadResult.message}
                    {uploadResult.success && uploadResult.recordsProcessed !== undefined && (
                      <div className="mt-2 text-sm">
                        <p>• Обработано записей: {uploadResult.recordsProcessed}</p>
                        {uploadResult.duplicatesSkipped! > 0 && (
                          <p>• Пропущено дубликатов: {uploadResult.duplicatesSkipped}</p>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearResult}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Формат файла:</strong> CSV с разделителем запятая</p>
          <p><strong>Обязательные поля:</strong> ID начисления, Тип начисления</p>
          <p><strong>Дубликаты:</strong> Автоматически пропускаются при повторной загрузке</p>
        </div>
      </CardContent>
    </Card>
  )
}