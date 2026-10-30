import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { Button } from '@mui/material'
import type { Category, Transaction } from '@/shared/api'
import { downloadCsv } from '@/shared/lib'
import { useNotify } from '@/shared/ui'

interface ExportCsvButtonProps {
  transactions: Transaction[]
  categories: Category[]
  fileSuffix: string
}

export function ExportCsvButton({ transactions, categories, fileSuffix }: ExportCsvButtonProps) {
  const notify = useNotify()

  const handleClick = () => {
    const names = new Map(categories.map(c => [c.id, c.name]))
    const rows = [...transactions]
      .sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id)
      .map(t => [
        t.date,
        t.type === 'income' ? 'Доход' : 'Расход',
        names.get(t.categoryId) ?? '',
        t.amount,
        t.comment ?? '',
      ])
    downloadCsv(`finance-${fileSuffix}.csv`, ['Дата', 'Тип', 'Категория', 'Сумма', 'Комментарий'], rows)
    notify.success(`Файл с операциями (${rows.length}) сохранён`)
  }

  return (
    <Button
      variant="outlined"
      startIcon={<FileDownloadOutlinedIcon />}
      onClick={handleClick}
      disabled={transactions.length === 0}
    >
      Экспорт в CSV
    </Button>
  )
}
