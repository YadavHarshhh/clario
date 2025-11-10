import { Router } from 'express'
import { repo } from '../repo.js'
import { z } from 'zod'

const router = Router()

const inputSchema = z.object({
  skinType: z.string().min(1),
  concerns: z.array(z.string()).min(1),
  hasAllergies: z.boolean().default(false),
  allergies: z.string().optional().nullable(),
  productPreference: z.enum(['all','natural','chemical-free']).default('all'),
  limit: z.coerce.number().int().min(1).max(50).default(12)
})

router.post('/', async (req, res) => {
  const parsed = inputSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const p = parsed.data

  const recs = await repo.recommend({
    skinType: p.skinType,
    concerns: p.concerns,
    hasAllergies: p.hasAllergies,
    allergies: p.allergies,
    productPreference: p.productPreference,
    limit: p.limit
  })
  res.json({ data: recs })
})

export default router


