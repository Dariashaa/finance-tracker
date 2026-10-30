import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
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
import { formatMoney, monthOf, todayIso, type MonthKey } from '@/shared/lib'
import { EmptyState } from '@/shared/ui'
import { useCategories } from '@/entities/category'
import {
  calcTotals,
  monthsWithData,
  SummaryBar,
  transactionsOfMonth,
  useTransactions,
} from '@/entities/transaction'
import { ExportCsvButton } from '@/features/export-csv'
import { FinanceDataBoundary } from '@/features/finance-data-boundary'
import { MonthSelect } from '@/features/month-select'
import { expenseBreakdown, monthlySeries } from '../model/report'

export function ReportsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h1">
        Отчёты и экспорт
      </Typography>
      <FinanceDataBoundary>
        <ReportsContent />
      </FinanceDataBoundary>
    </Stack>
  )
}

function ReportsContent() {
  const { items: categories } = useCategories()
  const { items: transactions } = useTransactions()
  const [month, setMonth] = useState<MonthKey>(() => monthsWithData(transactions).at(-1) ?? monthOf(todayIso()))

  const monthItems = transactionsOfMonth(transactions, month)
  const slices = expenseBreakdown(transactions, categories, month)
  const series = monthlySeries(transactions)

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <MonthSelect month={month} onChange={setMonth} />
        <ExportCsvButton transactions={monthItems} categories={categories} fileSuffix={month} />
      </Box>

      <SummaryBar totals={calcTotals(monthItems)} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">Расходы по категориям</Typography>
              {slices.length === 0 ? (
                <EmptyState title="Нет расходов за этот месяц" hint="Выберите другой месяц или добавьте операции" />
              ) : (
                <Box sx={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={slices} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="80%">
                        {slices.map(slice => (
                          <Cell key={slice.name} fill={slice.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatMoney(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">Динамика по месяцам</Typography>
              {series.length === 0 ? (
                <EmptyState title="Пока нет данных" hint="Добавьте первые операции на главной странице" />
              ) : (
                <Box sx={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={series}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" />
                      <YAxis width={60} tickFormatter={(v: number) => `${v / 1000}к`} />
                      <Tooltip formatter={(value) => formatMoney(Number(value))} />
                      <Legend />
                      <Bar dataKey="income" name="Доходы" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" name="Расходы" fill="#F44336" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}
