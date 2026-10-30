import { useState } from 'react'
import { getErrorMessage, type Category } from '@/shared/api'
import { ConfirmDialog, useNotify } from '@/shared/ui'
import { useCategories } from '@/entities/category'

interface Props {
  category: Category | null
  onClose: () => void
}

export function DeleteCategoryDialog({ category, onClose }: Props) {
  const { remove } = useCategories()
  const notify = useNotify()
  const [busy, setBusy] = useState(false)
  const [last, setLast] = useState<Category | null>(category)
  if (category && category !== last) setLast(category)
  const shown = category ?? last

  const handleConfirm = async () => {
    if (!category) return
    setBusy(true)
    try {
      await remove(category.id)
      notify.success('Категория удалена')
    } catch (error) {
      notify.error(getErrorMessage(error))
    } finally {
      setBusy(false)
      onClose()
    }
  }

  return (
    <ConfirmDialog
      open={category !== null}
      title="Удалить категорию?"
      text={shown ? `Категория «${shown.name}» будет удалена. Это действие нельзя отменить.` : ''}
      busy={busy}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  )
}
