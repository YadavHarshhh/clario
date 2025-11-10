import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import pino from 'pino'
import pinoHttp from 'pino-http'

import { apiKeyMiddleware } from './middleware/apiKey.js'
import productsRouter from './routes/products.js'
import usersRouter from './routes/users.js'
import recommendationsRouter from './routes/recommendations.js'

const app = express()
const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

app.use(pinoHttp({ logger }))
app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*'}))
app.use(express.json({ limit: '1mb' }))

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 })
app.use(limiter)

if (process.env.REQUIRE_API_KEY === 'true') {
  app.use(apiKeyMiddleware)
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use('/api/recommendations', recommendationsRouter)

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  logger.info({ port }, 'Clario API listening')
})


