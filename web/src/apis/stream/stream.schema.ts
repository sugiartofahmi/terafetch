import { z } from 'zod'

export const streamSearchSchema = z.object({
  id: z.string().min(1, 'Video ID is required'),
  url: z.string().url('A valid URL is required'),
})

export type TStreamSearchParams = z.infer<typeof streamSearchSchema>
