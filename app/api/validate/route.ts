import { validateDiagrams } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const graphStore = await request.json()
    const result = await validateDiagrams(graphStore)
    return Response.json(result)
  } catch (error) {
    console.error('Validation endpoint error:', error)
    return Response.json(
      { error: 'Validation failed', flags: [] },
      { status: 500 }
    )
  }
}
