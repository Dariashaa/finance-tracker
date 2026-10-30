import { Box, Typography } from '@mui/material'
import type { Category } from '@/shared/api'

interface CategoryChipProps {
  category: Pick<Category, 'name' | 'color'>
}


export function CategoryChip({ category }: CategoryChipProps) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: category.color, flexShrink: 0 }} />
      <Typography variant="body2" component="span">
        {category.name}
      </Typography>
    </Box>
  )
}
