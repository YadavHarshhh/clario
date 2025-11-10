import { Router } from 'express'
import { repo } from '../repo.js'
import { z } from 'zod'

const router = Router()

const listQuerySchema = z.object({
  search: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  category: z.string().trim().optional(),
  skinType: z.string().trim().optional(),
  concerns: z.string().trim().optional(),
  ingredients: z.string().trim().optional(),
  priceMin: z.coerce.number().int().min(0).optional(),
  priceMax: z.coerce.number().int().min(0).optional(),
  sort: z.enum(['popular','price-low','price-high','rating','newest']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
  match: z.enum(['any','all']).default('any')
})

router.get('/', async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const q = parsed.data

  const { rows, total } = await repo.listProducts(q)
  res.json({ data: rows, page: q.page, pageSize: q.pageSize, total, totalPages: Math.ceil(total / q.pageSize) })
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' })
  const p = await repo.getProductById(id)
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json(p)
})

export default router


