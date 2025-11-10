import { Router } from "express"
import { z } from "zod"
import { repo } from "../repo.js"
import { generateJsonResponse } from "../services/gemini.js"

const router = Router()

const summarizeSchema = z.object({
  query: z.string().min(1),
  category: z.string().optional(),
  skinType: z.string().optional(),
  concerns: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(8).default(5),
})

router.post("/summaries", async (req, res) => {
  let parsed
  try {
    parsed = summarizeSchema.parse(req.body)
  } catch (error) {
    return res.status(400).json({ error: error.errors ?? error })
  }

  const { query, category, skinType, concerns, limit } = parsed
  const { rows } = await repo.listProducts({
    search: query,
    category,
    skinType,
    pageSize: limit,
  })

  if (!rows.length) {
    return res.json({ summary: "No matching products found for your query.", highlights: [], recommendedProductIds: [] })
  }

  const context = rows.map((p, idx) => ({
    rank: idx + 1,
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    skin_types: p.skin_types,
    ingredients: p.ingredients,
    ai_summary: p.ai_summary,
    ai_benefits: p.ai_benefits,
    ai_usage_tips: p.ai_usage_tips,
    ai_allergy_alerts: p.ai_allergy_alerts,
  }))

  const prompt = `You are Clario's skincare assistant. Summarize search results for an Indian skincare catalog user.
User query: "${query}"
User filters: ${JSON.stringify({ category, skinType, concerns })}
Here are the top products in JSON: ${JSON.stringify(context, null, 2)}

Rules:
- Only use information present in the provided products.
- Provide a short overview (<= 70 words) that answers the query.
- Provide 3 highlight bullet points.
- Include up to ${limit} recommended product ids from the list, ordered by relevance.
Return JSON following the schema.`

  const schema = {
    type: "object",
    properties: {
      summary: { type: "string" },
      highlights: { type: "array", items: { type: "string" } },
      recommendedProductIds: { type: "array", items: { type: "integer" } },
    },
    required: ["summary", "highlights", "recommendedProductIds"],
  }

  try {
    const response = await generateJsonResponse({ prompt, schema, modelName: process.env.GEMINI_MODEL_SUMMARY })
    res.json({ ...response, productsUsed: context.map((p) => p.id) })
  } catch (error) {
    console.error("Gemini summarize error", error)
    res.status(500).json({ error: "Failed to generate summary" })
  }
})

const askSchema = z.object({
  question: z.string().min(1),
  productId: z.coerce.number().int().optional(),
  category: z.string().optional(),
  skinType: z.string().optional(),
  concerns: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(6).default(4),
})

router.post("/ask", async (req, res) => {
  let parsed
  try {
    parsed = askSchema.parse(req.body)
  } catch (error) {
    return res.status(400).json({ error: error.errors ?? error })
  }

  const { question, productId, category, skinType, concerns, limit } = parsed
  
  let context = []
  
  // If productId is provided, fetch that specific product first
  if (productId) {
    const product = await repo.getProductById(productId)
    if (product) {
      context.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        skin_types: product.skin_types,
        ingredients: product.ingredients || [],
        concerns: product.concerns || [],
        description: product.description,
        ai_summary: product.ai_summary,
        ai_benefits: product.ai_benefits || [],
        ai_usage_tips: product.ai_usage_tips || [],
        ai_allergy_alerts: product.ai_allergy_alerts || [],
      })
      console.log(`[Q&A] Using product ${productId}: ${product.name}`)
    } else {
      console.warn(`[Q&A] Product ${productId} not found`)
    }
  }
  
  // If we don't have enough context, search for related products
  if (context.length < limit) {
    const { rows } = await repo.listProducts({
      search: question,
      category,
      skinType,
      pageSize: limit - context.length,
    })
    
    // Add products that aren't already in context
    for (const p of rows) {
      if (!context.find(c => c.id === p.id)) {
        context.push({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          skin_types: p.skin_types,
          ingredients: p.ingredients,
          concerns: p.concerns,
          description: p.description,
          ai_summary: p.ai_summary,
          ai_benefits: p.ai_benefits,
          ai_usage_tips: p.ai_usage_tips,
          ai_allergy_alerts: p.ai_allergy_alerts,
        })
      }
    }
  }

  if (!context.length) {
    return res.json({ answer: "I could not find relevant products to answer that question. Please try asking about a specific product or category.", references: [] })
  }

  const primaryProduct = productId ? context.find(p => p.id === productId) : context[0]
  const isProductSpecific = !!productId
  
  const prompt = `You are Clario's skincare assistant. A user asked: "${question}".
${isProductSpecific ? `The user is asking about a specific product: "${primaryProduct?.name}" by ${primaryProduct?.brand}.` : ''}
Use only the following product context to answer:
${JSON.stringify(context, null, 2)}

Guidelines:
- ${isProductSpecific ? 'Focus primarily on the specific product mentioned above.' : 'Answer based on the products provided.'}
- Answer in 2 short paragraphs max.
- Reference product names when relevant.
- Include allergy caveats if present in the data.
- If you cannot answer from the context, say so.
Return JSON following the schema.`

  const schema = {
    type: "object",
    properties: {
      answer: { type: "string" },
      references: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            reason: { type: "string" },
          },
          required: ["id", "reason"],
        },
      },
    },
    required: ["answer", "references"],
  }

  try {
    const response = await generateJsonResponse({ prompt, schema, modelName: process.env.GEMINI_MODEL_QA })
    if (!response || !response.answer) {
      console.error("Gemini returned invalid response:", response)
      return res.status(500).json({ error: "Failed to generate answer", details: "Invalid response from AI" })
    }
    res.json({ ...response, productsUsed: context.map((p) => p.id) })
  } catch (error) {
    console.error("Gemini ask error", error)
    const errorMessage = error.message || "Unknown error"
    res.status(500).json({ error: "Failed to generate answer", details: errorMessage })
  }
})

export default router


