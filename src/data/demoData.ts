import type { Category, Transaction } from '../types'

export const categories: Category[] = [
  { id: 1, name: 'Еда', type: 'expense', color: '#3F51B5', limit: 30000 },
  { id: 2, name: 'Транспорт', type: 'expense', color: '#2196F3', limit: 3000 },
  { id: 3, name: 'Развлечения', type: 'expense', color: '#F44336', limit: 5000 },
  { id: 4, name: 'Подарки', type: 'expense', color: '#795548' },
  { id: 5, name: 'Зарплата', type: 'income', color: '#4CAF50' },
  { id: 6, name: 'Подработка', type: 'income', color: '#9C27B0' },
]

export const transactions: Transaction[] = [
  { id: 1, type: 'expense', amount: 12000, date: '2025-03-03', categoryId: 1, comment: 'Продукты на неделю' },
  { id: 2, type: 'expense', amount: 9800, date: '2025-03-12', categoryId: 1 },
  { id: 3, type: 'expense', amount: 5200, date: '2025-03-24', categoryId: 1 },
  { id: 4, type: 'expense', amount: 1200, date: '2025-03-05', categoryId: 2 },
  { id: 5, type: 'expense', amount: 700, date: '2025-03-18', categoryId: 2 },
  { id: 6, type: 'expense', amount: 4200, date: '2025-03-09', categoryId: 3, comment: 'Кино и ужин' },
  { id: 7, type: 'expense', amount: 3000, date: '2025-03-23', categoryId: 3 },
  { id: 8, type: 'expense', amount: 1000, date: '2025-03-07', categoryId: 4, comment: 'Подарок маме' },
  { id: 9, type: 'income', amount: 40000, date: '2025-03-10', categoryId: 5 },
  { id: 10, type: 'income', amount: 15000, date: '2025-03-15', categoryId: 6, comment: 'Фриланс' },
  { id: 11, type: 'expense', amount: 11000, date: '2025-02-06', categoryId: 1 },
  { id: 12, type: 'expense', amount: 2400, date: '2025-02-14', categoryId: 2 },
  { id: 13, type: 'income', amount: 40000, date: '2025-02-10', categoryId: 5 },
]
