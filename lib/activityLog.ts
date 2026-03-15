import { create } from 'zustand'

export type ActivityEvent = {
  id: string
  action: 'added' | 'removed' | 'edited'
  entityKind: string
  entityName: string
  userName: string
  color: string
  timestamp: number
}

const MAX_EVENTS = 30

type ActivityLogStore = {
  events: ActivityEvent[]
  addEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void
}

export const useActivityLog = create<ActivityLogStore>((set) => ({
  events: [],
  addEvent: (event) =>
    set((state) => ({
      events: [
        ...state.events.slice(-(MAX_EVENTS - 1)),
        { ...event, id: `${Date.now()}-${Math.random()}`, timestamp: Date.now() },
      ],
    })),
}))
