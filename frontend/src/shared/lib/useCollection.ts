import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage, type CollectionApi } from '@/shared/api'

export type LoadStatus = 'loading' | 'error' | 'ready'

export interface CollectionState<T, TInput> {
  items: T[]
  status: LoadStatus
  error: string | null
  reload: () => void
  create: (input: TInput) => Promise<T>
  update: (id: number, input: TInput) => Promise<T>
  remove: (id: number) => Promise<void>
}

export function useCollection<T extends { id: number }, TInput>(
  api: CollectionApi<T, TInput>,
): CollectionState<T, TInput> {
  const [items, setItems] = useState<T[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    api
      .list()
      .then(data => {
        if (cancelled) return
        setItems(data)
        setError(null)
        setStatus('ready')
      })
      .catch(e => {
        if (cancelled) return
        setError(getErrorMessage(e))
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [api, attempt])

  const reload = useCallback(() => {
    setStatus('loading')
    setAttempt(n => n + 1)
  }, [])

  const create = useCallback(
    async (input: TInput) => {
      const created = await api.create(input)
      setItems(prev => [...prev, created])
      return created
    },
    [api],
  )

  const update = useCallback(
    async (id: number, input: TInput) => {
      const updated = await api.update(id, input)
      setItems(prev => prev.map(item => (item.id === id ? updated : item)))
      return updated
    },
    [api],
  )

  const remove = useCallback(
    async (id: number) => {
      await api.remove(id)
      setItems(prev => prev.filter(item => item.id !== id))
    },
    [api],
  )

  return { items, status, error, reload, create, update, remove }
}
