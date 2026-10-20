export interface Category {
    id: number,
    name: string,
    type: 'income' | 'expense',
    color: string,
    limit?: number
}

export interface Transaction {
    id: number,
    type: 'income' | 'expense',
    amount: number,
    date: string,
    categoryId: number,
    comment?: string
}