/**
 * Test script to validate Zustand store functionality
 * Run this in browser console: copy-paste the entire script
 */

(async () => {
  console.log('=== Starting Zustand Store Tests ===\n')

  try {
    // Test 1: Import and verify store
    console.log('Test 1: Checking store module...')
    const module = await import('/lib/store/graphStore.js')
    console.log('✓ Store module imported successfully')
    console.log('  Available exports:', Object.keys(module))

    if (!module.useGraphStore) {
      throw new Error('useGraphStore not found in module')
    }
    console.log('✓ useGraphStore found\n')

    // Test 2: Get store state
    console.log('Test 2: Getting store state...')
    const store = module.useGraphStore.getState()
    console.log('✓ Store state retrieved')
    console.log('  Initial entities:', Object.keys(store.entities).length)
    console.log('  Initial relationships:', Object.keys(store.relationships).length)
    console.log('  Active diagram:', store.activeDiagram, '\n')

    // Test 3: Add an entity
    console.log('Test 3: Adding entity "TestClass"...')
    const classId = store.addEntity('class', 'TestClass')
    console.log('✓ Entity added with ID:', classId)
    const addedEntity = store.entities[classId]
    console.log('  Entity details:', {
      id: addedEntity.id,
      kind: addedEntity.kind,
      name: addedEntity.name,
      attributes: addedEntity.attributes,
      methods: addedEntity.methods,
    })

    if (!addedEntity || addedEntity.name !== 'TestClass') {
      throw new Error('Entity not added correctly')
    }
    console.log('✓ Entity verified\n')

    // Test 4: Update entity
    console.log('Test 4: Updating entity with attributes...')
    store.updateEntity(classId, {
      attributes: ['-id: String', '+name: String'],
    })
    const updatedEntity = store.entities[classId]
    console.log('✓ Entity updated')
    console.log('  Updated attributes:', updatedEntity.attributes)

    if (!updatedEntity.attributes || updatedEntity.attributes.length !== 2) {
      throw new Error('Entity attributes not updated correctly')
    }
    console.log('✓ Update verified\n')

    // Test 5: Load scenario
    console.log('Test 5: Loading scenario...')
    const scenariosModule = await import('/lib/scenarios.js')
    const { SCENARIOS } = scenariosModule

    if (!SCENARIOS || !SCENARIOS.jordan) {
      throw new Error('Scenarios not available')
    }

    const jordanScenario = SCENARIOS.jordan
    console.log('✓ Scenario loaded')
    console.log('  Scenario entities:', Object.keys(jordanScenario.entities))
    console.log('  Scenario relationships:', Object.keys(jordanScenario.relationships))

    store.loadScenario(jordanScenario)
    const entityCount = Object.keys(store.entities).length
    const relationshipCount = Object.keys(store.relationships).length

    console.log('✓ Scenario loaded into store')
    console.log('  Total entities:', entityCount)
    console.log('  Total relationships:', relationshipCount)

    if (entityCount !== 3) {
      throw new Error(`Expected 3 entities, got ${entityCount}`)
    }
    if (relationshipCount !== 2) {
      throw new Error(`Expected 2 relationships, got ${relationshipCount}`)
    }
    console.log('✓ Scenario verification passed\n')

    // Test 6: Verify store mutations
    console.log('Test 6: Testing store mutation tracking...')
    const storeState1 = module.useGraphStore.getState()
    const entity1Count = Object.keys(storeState1.entities).length

    store.addEntity('interface', 'IEventManager')
    const storeState2 = module.useGraphStore.getState()
    const entity2Count = Object.keys(storeState2.entities).length

    console.log('✓ Store mutation tracked')
    console.log(`  Entities before: ${entity1Count}, after: ${entity2Count}`)

    if (entity2Count !== entity1Count + 1) {
      throw new Error('Store mutations not tracked correctly')
    }
    console.log('✓ Mutation tracking verified\n')

    console.log('=== All Store Tests PASSED ===')
    window.storeTestsPassed = true
    window.testResults = {
      timestamp: new Date().toISOString(),
      testsRun: 6,
      passed: true,
      details: {
        storeImport: 'passed',
        stateRetrieval: 'passed',
        entityAddition: 'passed',
        entityUpdate: 'passed',
        scenarioLoading: 'passed',
        mutationTracking: 'passed',
      },
    }
  } catch (error) {
    console.error('\n❌ Test Failed:', error.message)
    console.error('Stack:', error.stack)
    window.storeTestsPassed = false
    window.testResults = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
    }
  }
})()
