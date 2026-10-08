import { useState } from 'react'
import { Button, MenuItem, Paper, Select, Stack, Typography } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useData } from '../context/dataContext'
import { getMonths, monthLabel, sumAmounts } from '../utils/finance'

const ALL = 'all'

const formatMoney = (value: number) => value.toLocaleString('ru-RU') + ' ₽'

function ReportsPage() {
  // Период: один месяц или все
  const { categories, transactions } = useData()
  const months = getMonths(transactions)
  const [selectedPeriod, setSelectedPeriod] = useState<string>(ALL)
  // Если выбранного месяца больше нет, показываем весь период
  const period =
    selectedPeriod === ALL || months.includes(selectedPeriod) ? selectedPeriod : ALL

  const periodTransactions =
    period === ALL ? transactions : transactions.filter(t => t.date.startsWith(period))

  // Данные для круговой диаграммы: расходы по категориям за период
  const pieData = categories
    .filter(c => c.type === 'expense')
    .map(c => ({
      name: c.name,
      color: c.color,
      value: sumAmounts(periodTransactions.filter(t => t.categoryId === c.id)),
    }))
    .filter(item => item.value > 0)

  // Данные для столбчатой диаграммы: доходы и расходы по месяцам (от старых к новым)
  const barData = [...months].reverse().map(m => ({
    month: monthLabel(m),
    Доходы: sumAmounts(transactions.filter(t => t.type === 'income' && t.date.startsWith(m))),
    Расходы: sumAmounts(transactions.filter(t => t.type === 'expense' && t.date.startsWith(m))),
  }))

  // Экспорт операций выбранного периода в CSV
  const exportCsv = () => {
    const header = ['Дата', 'Тип', 'Категория', 'Сумма', 'Комментарий']
    const rows = [...periodTransactions]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(t => [
        t.date,
        t.type === 'expense' ? 'Расход' : 'Доход',
        categories.find(c => c.id === t.categoryId)?.name ?? '',
        String(t.amount),
        t.comment ?? '',
      ])

    // Значения с кавычками экранируются, разделитель ; открывается в русском Excel
    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(';'))
      .join('\r\n')

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `operations-${period}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Stack spacing={3} sx={{ py: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Typography variant="h5">Отчёты</Typography>
        <Stack direction="row" spacing={2}>
          <Select size="small" value={period} onChange={event => setSelectedPeriod(event.target.value)}>
            <MenuItem value={ALL}>Весь период</MenuItem>
            {months.map(m => (
              <MenuItem key={m} value={m}>
                {monthLabel(m)}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={exportCsv}>
            Экспорт CSV
          </Button>
        </Stack>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Расходы по категориям
        </Typography>
        {pieData.length === 0 ? (
          <Typography sx={{ color: 'text.secondary' }}>Нет расходов за выбранный период</Typography>
        ) : (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label>
                  {pieData.map(item => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip formatter={value => formatMoney(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Доходы и расходы по месяцам
        </Typography>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={value => formatMoney(Number(value))} />
              <Legend />
              <Bar dataKey="Доходы" fill="#4CAF50" />
              <Bar dataKey="Расходы" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Paper>
    </Stack>
  )
}

export default ReportsPage