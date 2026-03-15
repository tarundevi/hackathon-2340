import { GraphStore, ValidationFlag } from '@/types/graph'

export interface ValidationResponse {
  flags: ValidationFlag[]
  error?: string
}

/**
 * Validates diagrams using the AI-powered /api/validate endpoint
 * @param graphStore The current graph store state to validate
 * @returns Promise resolving to validation results
 */
export async function validateDiagramsWithAI(
  graphStore: GraphStore
): Promise<ValidationFlag[]> {
  try {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphStore),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Validation API error:', error)
      return [
        {
          severity: 'error',
          message: `Validation failed: ${response.statusText}`,
        },
      ]
    }

    const data: ValidationResponse = await response.json()

    if (data.error) {
      return [
        {
          severity: 'error',
          message: data.error,
        },
      ]
    }

    return data.flags || []
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Validation request error:', errorMessage)
    return [
      {
        severity: 'error',
        message: `Validation error: ${errorMessage}`,
      },
    ]
  }
}

/**
 * Validates specific diagram aspects
 * @param graphStore The current graph store state
 * @param diagramType The diagram type to focus validation on
 * @returns Promise resolving to validation results
 */
export async function validateDiagram(
  graphStore: GraphStore,
  diagramType: 'ucd' | 'dcd' | 'sd'
): Promise<ValidationFlag[]> {
  const flags = await validateDiagramsWithAI(graphStore)
  // Filter flags relevant to the specific diagram type
  return flags.filter(flag => {
    if (!flag.entityId) return true
    const entity = graphStore.entities[flag.entityId]
    // Check if entity is relevant to this diagram type
    if (diagramType === 'ucd') return entity?.kind === 'actor' || entity?.kind === 'usecase'
    if (diagramType === 'dcd') return entity?.kind === 'class'
    if (diagramType === 'sd') return entity?.kind === 'lifeline'
    return true
  })
}

/**
 * Gets error count from validation flags
 */
export function getErrorCount(flags: ValidationFlag[]): number {
  return flags.filter(f => f.severity === 'error').length
}

/**
 * Gets warning count from validation flags
 */
export function getWarningCount(flags: ValidationFlag[]): number {
  return flags.filter(f => f.severity === 'warning').length
}

/**
 * Checks if validation passed (no errors)
 */
export function isValidationPassed(flags: ValidationFlag[]): boolean {
  return getErrorCount(flags) === 0
}
