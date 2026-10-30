import { useState } from 'react'
import { getErrorMessage, type Transaction } from '@/shared/api'
import { formatDay, formatMoney } from '@/shared/lib'
import { ConfirmDialog, useNotify } from '@/shared/ui'
import { useTransactions } from '@/entities/transaction'

interface Props {
  transaction: Transaction | null
  onClose: () => void
}

export function DeleteTransactionDialog({ transaction, onClose }: Props) {
  const { remove } = useTransactions()
  const notify = useNotify()
  const [busy, setBusy] = useState(false)
  const [last, setLast] = useState<Transaction | null>(transaction)
  if (transaction && transaction !== last) setLast(transaction)
  const shown = transaction ?? last

  const handleConfirm = async () => {
    if (!transaction) return
    setBusy(true)
    try {
      await remove(transaction.id)
      notify.success('Операция удалена')
    } catch (error) {
      notify.error(getErrorMessage(error))
    } finally {
      setBusy(false)
      onClose()
    }
  }

  return (
    <ConfirmDialog
      open={transaction !== null}
      title="Удалить операцию?"
      text={
        shown
          ? `${formatDay(shown.date)}, ${formatMoney(shown.amount)}. Это действие нельзя отменить.`
          : ''
      }
      busy={busy}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  )
}
