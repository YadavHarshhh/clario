import { CsvRepository } from './data/csvRepository.js'
import { query } from './db.js'

const useCsv = (process.env.USE_CSV || 'true') === 'true'

let csvRepo = null
if (useCsv) {
  const csvPath = process.env.CSV_PATH || '/home/harsh/Desktop/clario/data/skincare.csv'
  csvRepo = new CsvRepository(csvPath)
}

export const repo = {
  async listProducts(params) {
    if (useCsv) {
      const { data, total } = csvRepo.list(params)
      return { rows: data, total }
    }
    // DB path (unused when CSV enabled)
    return { rows: [], total: 0 }
  },
  async getProductById(id) {
    if (useCsv) return csvRepo.getById(id)
    const r = await query('SELECT * FROM products WHERE id = $1', [id])
    return r.rows[0] || null
  },
  async recommend(params) {
    if (useCsv) return csvRepo.recommend(params)
    return []
  }
}


