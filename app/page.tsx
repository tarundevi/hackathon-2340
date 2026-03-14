'use client'

export default function Home() {
  return (
    <div className="flex h-full w-full bg-gray-100">
      {/* Left Panel - Scenarios */}
      <div className="w-64 border-r border-gray-300 bg-white overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Scenarios</h2>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
              Jordan - Event Mgmt
            </button>
            <button className="w-full px-3 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300">
              Daniel - RSVP
            </button>
            <button className="w-full px-3 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300">
              Priya - Capacity
            </button>
            <button className="w-full px-3 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300">
              Blank Canvas
            </button>
          </div>
          <hr className="my-4" />
          <h3 className="text-sm font-semibold mb-2">Collaborators</h3>
          <div className="text-sm text-gray-600">
            No users online
          </div>
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="border-b border-gray-300 bg-gray-50 p-3 flex gap-2">
          <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium">
            UCD
          </button>
          <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium">
            DCD
          </button>
          <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium">
            SD
          </button>
          <span className="flex-1" />
          <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm">+Class</button>
          <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm">Undo</button>
        </div>
        <div className="flex-1 bg-white border border-gray-300 m-3 rounded">
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Canvas area - React Flow to be integrated
          </div>
        </div>
      </div>

      {/* Right Panel - AI & Traceability */}
      <div className="w-80 border-l border-gray-300 bg-white overflow-y-auto">
        <div className="border-b border-gray-300">
          <div className="flex">
            <button className="flex-1 px-3 py-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
              AI Assistant
            </button>
            <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
              Traceability
            </button>
          </div>
        </div>
        <div className="p-4">
          <button className="w-full px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 font-medium">
            Run AI Check
          </button>
          <div className="mt-4 text-sm text-gray-600">
            No validation results
          </div>
        </div>
      </div>
    </div>
  )
}
