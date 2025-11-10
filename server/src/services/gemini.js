import { GoogleGenerativeAI } from "@google/generative-ai"

let cachedClient = null

function getClient() {
  if (!cachedClient) {
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set. Add it to your environment to use Gemini features.")
    }
    cachedClient = new GoogleGenerativeAI(apiKey)
  }
  return cachedClient
}

export function getModel(modelName) {
  const client = getClient()
  const model = modelName || process.env.GEMINI_MODEL || "gemini-2.5-flash"
  return client.getGenerativeModel({ model })
}

export async function generateJsonResponse({ prompt, schema, modelName }) {
  try {
    const model = getModel(modelName)
    // Add schema description to prompt if provided
    let finalPrompt = prompt
    if (schema) {
      finalPrompt += `\n\nReturn a valid JSON object matching this structure: ${JSON.stringify(schema, null, 2)}`
    } else {
      finalPrompt += "\n\nReturn a valid JSON object."
    }
    
    const generationConfig = {
      responseMimeType: "application/json",
    }
    
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
      generationConfig,
    })
    const text = response?.response?.text?.()
    if (!text) {
      console.error("Gemini returned empty response")
      return null
    }
    try {
      // Clean up any markdown code blocks if present
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      const parsed = JSON.parse(cleaned)
      return parsed
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON response", parseError)
      console.error("Raw response:", text.substring(0, 500))
      return null
    }
  } catch (apiError) {
    console.error("Gemini API error:", apiError.message || apiError)
    if (apiError.status === 503 || apiError.status === 429) {
      throw new Error("AI service is temporarily overloaded. Please try again in a moment.")
    }
    throw apiError
  }
}


