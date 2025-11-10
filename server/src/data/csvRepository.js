import fs from 'node:fs'
import { parse } from 'csv-parse/sync'

function toArray(value) {
  if (!value) return []
  return String(value).split(',').map(v => v.trim().toLowerCase()).filter(Boolean)
}

export class CsvRepository {
  constructor(csvPath) {
    this.csvPath = csvPath
    this.products = []
    this.loadedAt = 0
    this.load()
  }

  load() {
    const csv = fs.readFileSync(this.csvPath, 'utf8')
    const records = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
    this.products = records.map((r, idx) => {
      const name = r['prod_name'] || r['name']
      const category = r['category']
      const brand = r['Brand'] || r['brand']
      const skinTypes = toArray(r['Skin_Type'] || r['skin_types'])
      const url = r['Link'] || r['product_url']
      return {
        id: idx + 1,
        name,
        brand,
        price: 0,
        image: null,
        category,
        rating: 0,
        reviews: 0,
        description: null,
        skin_types: skinTypes,
        concerns: [],
        ingredients: [],
        benefits: [],
        is_natural: false,
        is_chemical_free: false,
        product_url: url,
        created_at: null,
        updated_at: null
      }
    }).filter(p => p.name && p.brand && p.category)
    this.loadedAt = Date.now()
  }

  list({
    search, brand, category, skinType, concerns, ingredients,
    priceMin, priceMax, sort, page = 1, pageSize = 24, match = 'any'
  }) {
    let result = [...this.products]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        (p.name?.toLowerCase().includes(q)) ||
        (p.brand?.toLowerCase().includes(q)) ||
        (p.category?.toLowerCase().includes(q))
      )
    }
    if (brand) result = result.filter(p => (p.brand||'').toLowerCase() === brand.toLowerCase())
    if (category) result = result.filter(p => (p.category||'').toLowerCase() === category.toLowerCase())
    if (skinType) result = result.filter(p => p.skin_types?.includes(skinType.toLowerCase()))

    if (concerns) {
      const list = concerns.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean)
      if (list.length) {
        result = result.filter(p => match === 'all' ? list.every(v => p.concerns?.includes(v)) : list.some(v => p.concerns?.includes(v)))
      }
    }
    if (ingredients) {
      const list = ingredients.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean)
      if (list.length) {
        result = result.filter(p => match === 'all' ? list.every(v => p.ingredients?.includes(v)) : list.some(v => p.ingredients?.includes(v)))
      }
    }
    if (priceMin != null) result = result.filter(p => p.price >= priceMin)
    if (priceMax != null) result = result.filter(p => p.price <= priceMax)

    switch (sort) {
      case 'price-low': result.sort((a,b)=>a.price-b.price); break
      case 'price-high': result.sort((a,b)=>b.price-a.price); break
      case 'rating': result.sort((a,b)=>b.rating-a.rating); break
      case 'newest': result.reverse(); break
      default: result.sort((a,b)=>b.reviews-a.reviews); break
    }

    const total = result.length
    const start = (page-1)*pageSize
    const data = result.slice(start, start+pageSize)
    return { data, total }
  }

  getById(id) {
    return this.products.find(p => p.id === id) || null
  }

  recommend({ skinType, concerns, hasAllergies, allergies, productPreference, limit = 12 }) {
    const concernList = (concerns||[]).map(c=>c.toLowerCase())
    let pool = this.products.filter(p => p.skin_types?.includes(skinType.toLowerCase()))
    // filter preferences (no-op with CSV-only fields defaulting false)
    if (productPreference === 'natural') pool = pool.filter(p => p.is_natural)
    if (productPreference === 'chemical-free') pool = pool.filter(p => p.is_chemical_free)
    if (hasAllergies && allergies) {
      const toks = allergies.split(/[;,]/).map(s=>s.trim().toLowerCase()).filter(Boolean)
      if (toks.length) pool = pool.filter(p => !toks.some(t => p.ingredients?.includes(t)))
    }
    // score: matches with any concern, plus rating/reviews (mostly zero here)
    const scored = pool.map(p => ({
      p,
      score: (concernList.some(c => p.concerns?.includes(c)) ? 1 : 0) + (p.rating/5) + Math.min(p.reviews/200,1)
    }))
    scored.sort((a,b)=>b.score-a.score)
    return scored.slice(0, limit).map(s=>s.p)
  }
}


