import 'dotenv/config'
import fs from 'node:fs'
import { parse } from 'csv-parse'
import { query } from '../src/db.js'

function toSkinTypes(value) {
  if (!value) return []
  // default delimiter: comma; change if needed
  return value.split(',').map(v => v.trim().toLowerCase()).filter(Boolean)
}

async function main() {
  const csvPath = process.env.CSV_PATH || '/home/harsh/Desktop/clario/data/skincare.csv'
  const rows = []
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
      .on('data', (r) => rows.push(r))
      .on('end', resolve)
      .on('error', reject)
  })

  let inserted = 0
  for (const r of rows) {
    const name = r['prod_name']
    const category = r['category']
    const brand = r['Brand']
    const skinTypes = toSkinTypes(r['Skin_Type'])
    const url = r['Link']
    if (!name || !category || !brand) continue

    await query(
      `INSERT INTO products (name, brand, category, product_url, skin_types)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT DO NOTHING`,
      [name, brand, category, url || null, skinTypes]
    )
    inserted++
  }

  // ensure sample products resemble current frontend search experience
  await query(`UPDATE products SET rating = COALESCE(rating,0) + 4.5 WHERE rating = 0`)

  console.log(`Imported ${inserted} products from ${csvPath}`)
}

main().catch((e) => { console.error(e); process.exit(1) })


