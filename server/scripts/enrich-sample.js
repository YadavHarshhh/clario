import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { generateJsonResponse } from "../src/services/gemini.js"

const csvPath = process.env.CSV_PATH || "/home/harsh/Desktop/clario/data/skincare.csv"
const outputPath = process.env.GEMINI_CACHE_PATH || path.resolve(process.cwd(), "../data/gemini-enrichment.json")

const schema = {
  type: "object",
  properties: {
    marketing_blurb: { type: "string" },
    top_benefits: { type: "array", items: { type: "string" } },
    usage_tips: { type: "array", items: { type: "string" } },
    allergy_alerts: { type: "array", items: { type: "string" } },
    confidence: { type: "number" },
  },
  required: ["marketing_blurb", "top_benefits", "usage_tips", "allergy_alerts", "confidence"],
}

function buildKey(name, brand) {
  return `${(name || "").trim().toLowerCase()}|${(brand || "").trim().toLowerCase()}`
}

async function main() {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found at ${csvPath}`)
  }

  const csv = fs.readFileSync(csvPath, "utf8")
  const records = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  let cache = {}
  if (fs.existsSync(outputPath)) {
    try {
      cache = JSON.parse(fs.readFileSync(outputPath, "utf8"))
    } catch (error) {
      console.warn("Failed to parse existing enrichment cache, starting fresh.")
    }
  }

  const enriched = { ...cache }
  const start = Date.now()

  // Enrich only products 75-85 (including product 79)
  const targetIndices = [74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84]
  console.log(`Enriching sample products (indices ${targetIndices[0]}-${targetIndices[targetIndices.length - 1]})...`)

  for (const index of targetIndices) {
    if (index >= records.length) continue
    const row = records[index]
    const name = row["prod_name"] || row["name"]
    const brand = row["Brand"] || row["brand"]
    if (!name || !brand) continue

    const key = buildKey(name, brand)
    if (enriched[key]?.marketing_blurb) {
      console.log(`[${index + 1}] ${name} (${brand}) - already enriched, skipping`)
      continue
    }

    const ingredients = row["ingredients"] || row["Skin_Type"] || ""
    const category = row["category"] || ""
    const prompt = `You are an Indian skincare expert and marketer. Given the following product details, create concise marketing copy and safety insights tailored for Indian consumers.\n\nProduct JSON:\n${JSON.stringify(
      {
        name,
        brand,
        category,
        description: row["description"] || "",
        skin_type: row["Skin_Type"] || "",
        ingredients,
        link: row["Link"] || row["product_url"] || "",
      },
      null,
      2,
    )}\n\nReturn JSON matching the provided schema. Keep answers short (marketing blurb <= 80 words, each list item <= 18 words).`

    console.log(`[${index + 1}] Generating enrichment for ${name.substring(0, 50)}... (${brand})`)
    let response = null
    let retries = 3
    while (retries > 0 && !response) {
      try {
        response = await generateJsonResponse({ prompt, schema })
        if (!response) {
          retries--
          if (retries > 0) {
            console.warn(`Retrying... (${3 - retries}/3)`)
            await new Promise((resolve) => setTimeout(resolve, 3000))
          }
        }
      } catch (error) {
        if (error.status === 503 || error.status === 429) {
          retries--
          if (retries > 0) {
            console.warn(`API overloaded, retrying in 5s... (${3 - retries}/3)`)
            await new Promise((resolve) => setTimeout(resolve, 5000))
          } else {
            console.warn(`Failed after retries for ${name}. Skipping.`)
          }
        } else {
          console.warn(`Error for ${name}: ${error.message}. Skipping.`)
          break
        }
      }
    }
    if (!response) {
      console.warn(`Gemini returned no data for ${name}. Skipping.`)
      continue
    }

    enriched[key] = {
      ...response,
      generated_at: new Date().toISOString(),
      source: "gemini",
    }

    // simple throttle to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 1200))
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(enriched, null, 2))
  console.log(`Enrichment complete in ${Math.round((Date.now() - start) / 1000)}s. Saved to ${outputPath}`)
  console.log(`\n✅ Enriched ${Object.keys(enriched).length} products. Product 79 should now show Gemini data!`)
}

main().catch((error) => {
  console.error("Failed to enrich products", error)
  process.exit(1)
})

