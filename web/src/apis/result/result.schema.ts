import { z } from 'zod'

export const breadcrumbItemSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const resultSearchSchema = z.object({
  url: z.string().url('A valid URL is required'),
  filter: z.enum(['all', 'video', 'photo']).optional().default('all'),
})

export type TResultSearchParams = z.infer<typeof resultSearchSchema>
