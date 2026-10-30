import { Collapse } from '@mui/material'
import type { ReactNode } from 'react'
import { TransitionGroup } from 'react-transition-group'

interface AnimatedListProps<T> {
  items: T[]
  getKey: (item: T) => string | number
  renderItem: (item: T) => ReactNode
}

export function AnimatedList<T>({ items, getKey, renderItem }: AnimatedListProps<T>) {
  return (
    <TransitionGroup component={null}>
      {items.map(item => (
        <Collapse key={getKey(item)}>{renderItem(item)}</Collapse>
      ))}
    </TransitionGroup>
  )
}
