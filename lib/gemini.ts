import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.warn('GEMINI_API_KEY not set - AI validation will be disabled')
}

const genAI = new GoogleGenerativeAI(apiKey || '')

export const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
})

export async function validateDiagrams(graphStore: any) {
  if (!apiKey) {
    return { flags: [] }
  }

  const prompt = buildValidationPrompt(graphStore)
  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const flags = parseGeminiResponse(text)
    return { flags }
  } catch (error) {
    console.error('Gemini validation error:', error)
    return { flags: [{ severity: 'error' as const, message: 'AI validation failed' }] }
  }
}

function buildValidationPrompt(graphStore: any): string {
  const entities = Object.values(graphStore.entities || {})
  const relationships = Object.values(graphStore.relationships || {})

  return `You are a UML diagram validator for a CS 2340 course project.

Analyze the following UML diagrams and identify issues:

ENTITIES (Classes, Actors, Use Cases):
${JSON.stringify(entities, null, 2)}

RELATIONSHIPS:
${JSON.stringify(relationships, null, 2)}

Check for these issues:
1. Sequence Diagram messages that reference methods not in the Class Diagram
2. Missing multiplicity labels on associations (should have labels like "1..*", "0..1", etc)
3. Missing visibility modifiers on DCD attributes/methods (should start with +, -, or #)
4. Incorrect arrow types (solid vs dashed vs open)
5. Missing or incorrect logic for Event Management, RSVP, or Capacity Management scenarios

Format your response as a JSON array of issues:
[
  { "severity": "error" | "warning", "message": "...", "entityId": "..." },
  ...
]

Return ONLY valid JSON, no other text.`
}

function parseGeminiResponse(text: string): any[] {
  try {
    // Extract JSON array from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return []
  } catch (error) {
    console.error('Failed to parse Gemini response:', error)
    return []
  }
}
