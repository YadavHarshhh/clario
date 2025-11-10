import { Router } from 'express'
import { query } from '../db.js'
import { z } from 'zod'

const router = Router()

const userSchema = z.object({
  skin_type: z.string().min(1),
  concerns: z.array(z.string()).default([]),
  has_allergies: z.boolean().default(false),
  allergies: z.string().optional().nullable(),
  product_preference: z.enum(['all','natural','chemical-free']).default('all')
})

router.post('/', async (req, res) => {
  const parsed = userSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const u = parsed.data
  const r = await query(
    `INSERT INTO users (skin_type, concerns, has_allergies, allergies, product_preference)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [u.skin_type, u.concerns.map(v=>v.toLowerCase()), u.has_allergies, u.allergies || null, u.product_preference]
  )
  res.status(201).json(r.rows[0])
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const r = await query('SELECT * FROM users WHERE id = $1', [id])
  if (!r.rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(r.rows[0])
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const parsed = userSchema.partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const u = parsed.data

  const fields = []
  const params = []
  if (u.skin_type !== undefined) { params.push(u.skin_type); fields.push('skin_type = $' + params.length) }
  if (u.concerns !== undefined) { params.push(u.concerns.map(v=>v.toLowerCase())); fields.push('concerns = $' + params.length) }
  if (u.has_allergies !== undefined) { params.push(u.has_allergies); fields.push('has_allergies = $' + params.length) }
  if (u.allergies !== undefined) { params.push(u.allergies ?? null); fields.push('allergies = $' + params.length) }
  if (u.product_preference !== undefined) { params.push(u.product_preference); fields.push('product_preference = $' + params.length) }
  if (!fields.length) return res.status(400).json({ error: 'No changes' })
  params.push(id)
  const r = await query(`UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`, params)
  if (!r.rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(r.rows[0])
})

export default router


