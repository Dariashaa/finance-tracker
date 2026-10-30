import { useCallback, useState } from 'react'
import { ApiError, getErrorMessage } from '@/shared/api'


export function useSubmit() {
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const run = useCallback(async (action: () => Promise<unknown>): Promise<boolean> => {
    setSubmitting(true)
    setFormError(null)
    setFieldErrors({})
    try {
      await action()
      return true
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fieldErrors).length > 0) {
        setFieldErrors(error.fieldErrors)
      } else {
        setFormError(getErrorMessage(error))
      }
      return false
    } finally {
      setSubmitting(false)
    }
  }, [])

    const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      if (!(field in prev)) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  return { submitting, formError, fieldErrors, run, clearFieldError }
}
