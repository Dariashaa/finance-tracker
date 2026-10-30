import { Box, Skeleton, Stack } from '@mui/material'

interface LoadingStateProps {
  rows?: number
}

export function LoadingState({ rows = 4 }: LoadingStateProps) {
  return (
    <Stack spacing={1.5} role="status" aria-label="Загрузка данных">
      {Array.from({ length: rows }, (_, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Skeleton variant="circular" width={36} height={36} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="60%" />
            <Skeleton width="35%" />
          </Box>
          <Skeleton width={70} />
        </Box>
      ))}
    </Stack>
  )
}
