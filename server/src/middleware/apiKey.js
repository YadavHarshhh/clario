export function apiKeyMiddleware(req, res, next) {
  const headerKey = req.header('x-api-key')
  if (!headerKey || headerKey !== (process.env.API_KEY || 'dev-key')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}


