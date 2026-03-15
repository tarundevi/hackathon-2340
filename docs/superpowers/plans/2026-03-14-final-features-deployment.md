# Final Features & Deployment Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the UML collaboration tool with lobby system, AI validation, and production deployment.

**Architecture:**
- **Lobby system**: Room selection UI before canvas, URL-based room parameter, dynamic Yjs room switching
- **AI Validation**: Wire existing `/api/validate` endpoint to RightPanel "Run AI Check" button with proper error handling
- **Deployment**: Vercel for Next.js frontend, Railway for Yjs WebSocket server, environment configuration
- **Testing**: End-to-end verification across network, multi-client sync, AI validation

**Tech Stack:** Next.js, Vercel, Railway, Yjs, Zustand, Gemini API

---

## File Structure

```
app/
├── page.tsx                          [MODIFY] Conditionally show lobby or canvas
└── lobby/
    └── page.tsx                      [CREATE] Room selection/creation UI

components/
├── lobby/
│   └── RoomSelector.tsx              [CREATE] Room selection with URL linking
└── panels/
    └── RightPanel.tsx                [MODIFY] Wire "Run AI Check" button

lib/
├── ydoc.ts                           [MODIFY] Support dynamic room switching
├── rooms.ts                          [CREATE] Room management utilities
└── validation.ts                     [CREATE] AI validation error handling

docs/
└── DEPLOYMENT.md                     [CREATE] Deployment guide for Vercel + Railway

.env.local (user adds)
- GEMINI_API_KEY
- NEXT_PUBLIC_WS_URL (prod: wss://your-railway-server)
```

---

## Chunk 1: Lobby/Room System

### Task 1: Create Room Management Utilities

**Files:**
- Create: `lib/rooms.ts`

- [ ] **Step 1: Create room utilities**

```typescript
// lib/rooms.ts
export function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

export function getRoomFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('room');
}

export function setRoomInUrl(room: string): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('room', room);
  window.history.replaceState({}, '', url.toString());
}

export function getRoomUrl(room: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.set('room', room);
  return url.toString();
}
```

- [ ] **Step 2: Verify file created**

```bash
test -f lib/rooms.ts && echo "✓ File created"
```

- [ ] **Step 3: Commit**

```bash
git add lib/rooms.ts
git commit -m "feat: add room management utilities"
```

---

### Task 2: Create RoomSelector Component

**Files:**
- Create: `components/lobby/RoomSelector.tsx`

- [ ] **Step 1: Create room selector UI**

```typescript
"use client"

import { useState, useEffect } from 'react';
import { generateRoomId, getRoomFromUrl, setRoomInUrl } from '@/lib/rooms';

export default function RoomSelector({ onRoomSelect }: { onRoomSelect: (room: string) => void }) {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [inputRoom, setInputRoom] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const urlRoom = getRoomFromUrl();
    if (urlRoom) {
      setSelectedRoom(urlRoom);
    }
  }, []);

  const handleCreateRoom = () => {
    const newRoom = generateRoomId();
    setSelectedRoom(newRoom);
    setRoomInUrl(newRoom);
    onRoomSelect(newRoom);
  };

  const handleJoinRoom = () => {
    if (inputRoom.trim()) {
      const room = inputRoom.trim().toUpperCase();
      setSelectedRoom(room);
      setRoomInUrl(room);
      onRoomSelect(room);
      setInputRoom('');
      setShowInput(false);
    }
  };

  const handleQuickStart = () => {
    const newRoom = generateRoomId();
    setSelectedRoom(newRoom);
    setRoomInUrl(newRoom);
    onRoomSelect(newRoom);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gt-navy via-[#1a1744] to-gt-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            <span className="text-gt-techgold">GT</span> UML Collab
          </h1>
          <p className="text-gray-300 text-sm">Real-time collaborative UML diagram editor</p>
        </div>

        {/* Room Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gt-navy mb-2">Join or Create Room</h2>
            <p className="text-gray-600 text-sm">Work together on UML diagrams in real-time</p>
          </div>

          {/* Quick Start */}
          <button
            onClick={handleQuickStart}
            className="w-full bg-gt-techgold hover:bg-[#d49a00] text-gt-navy font-bold py-3 px-4 rounded-lg transition-all"
          >
            ⚡ Quick Start (New Room)
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Join Room */}
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="w-full border-2 border-gt-navy text-gt-navy hover:bg-gray-50 font-bold py-3 px-4 rounded-lg transition-all"
            >
              🔗 Join Existing Room
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={inputRoom}
                onChange={(e) => setInputRoom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                placeholder="Enter room code (e.g., ABC1234)"
                className="w-full px-4 py-3 border-2 border-gt-navy rounded-lg text-gt-navy placeholder-gray-400 focus:outline-none focus:border-gt-techgold"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleJoinRoom}
                  className="flex-1 bg-gt-navy hover:bg-[#1a1744] text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Join
                </button>
                <button
                  onClick={() => {
                    setShowInput(false);
                    setInputRoom('');
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {selectedRoom && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Room Code</p>
              <p className="text-2xl font-bold text-green-700 font-mono">{selectedRoom}</p>
              <p className="text-xs text-gray-500 mt-2">Share this code with teammates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify file created**

```bash
test -f components/lobby/RoomSelector.tsx && echo "✓ File created"
```

- [ ] **Step 3: Commit**

```bash
git add components/lobby/RoomSelector.tsx
git commit -m "feat: create room selector component with URL-based linking"
```

---

### Task 3: Update app/page.tsx to Show Lobby

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update page.tsx to conditionally show lobby**

Replace entire file with:

```typescript
"use client"

import { useState, useEffect } from 'react';
import RoomSelector from '@/components/lobby/RoomSelector';
import LeftPanel from '@/components/panels/LeftPanel';
import RightPanel from '@/components/panels/RightPanel';
import DiagramCanvas from '@/components/canvas/DiagramCanvas';
import DiagramTabs from '@/components/canvas/DiagramTabs';
import Toolbar from '@/components/canvas/Toolbar';
import TitleDisplay from '@/components/canvas/TitleDisplay';
import PlaybackSlider from '@/components/canvas/PlaybackSlider';
import CollabCursors from '@/components/cursors/CollabCursors';
import { getRoomFromUrl } from '@/lib/rooms';

export default function Home() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const room = getRoomFromUrl();
    setCurrentRoom(room);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gt-navy" />;
  }

  if (!currentRoom) {
    return <RoomSelector onRoomSelect={setCurrentRoom} />;
  }

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gt-light text-gt-dark font-sans selection:bg-gt-techgold selection:text-gt-navy">
      {/* Collaboration features (Cursors) */}
      <CollabCursors />

      {/* Left sidebar - Scenarios and Presence */}
      <LeftPanel />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-white">
        <DiagramTabs />

        {/* Absolute UI overlay elements */}
        <div className="absolute top-[50px] left-0 w-full flex justify-between px-6 pointer-events-none z-50">
          <div className="flex-1 flex justify-center pointer-events-auto">
            <Toolbar />
          </div>
        </div>
        <div className="absolute top-[50px] right-6 pointer-events-auto z-50">
          <TitleDisplay roomCode={currentRoom} />
        </div>

        <div className="flex-1 relative border-x border-gray-200">
          <DiagramCanvas />
          <PlaybackSlider />
        </div>
      </div>

      {/* Right sidebar - AI and Traceability */}
      <RightPanel />
    </main>
  );
}
```

- [ ] **Step 2: Update TitleDisplay to show room code**

Modify `components/canvas/TitleDisplay.tsx` to accept `roomCode` prop and display it:

```typescript
export default function TitleDisplay({ roomCode }: { roomCode?: string }) {
  return (
    <div className="text-right">
      <h1 className="text-sm font-bold text-gt-navy">CS 2340</h1>
      {roomCode && <p className="text-xs text-gray-500">Room: {roomCode}</p>}
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/canvas/TitleDisplay.tsx
git commit -m "feat: add lobby system with room selection before canvas"
```

---

### Task 4: Update lib/ydoc.ts to Support Room Switching

**Files:**
- Modify: `lib/ydoc.ts`

- [ ] **Step 1: Update WebSocket provider to use dynamic room**

Modify `lib/ydoc.ts` to use room from URL:

```typescript
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import type { Entity, Relationship, ViewPosition } from '@/types/graph'

// Initialize shared Y.Doc
export const ydoc = new Y.Doc()

// Get room from URL or default
function getRoomId(): string {
  if (typeof window === 'undefined') return 'default-room'
  const params = new URLSearchParams(window.location.search)
  return params.get('room') || 'default-room'
}

// WebSocket provider for real-time sync with dynamic room
const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:1234'
export const provider = new WebsocketProvider(
  wsUrl,
  getRoomId(),  // Use dynamic room from URL
  ydoc
)

// Create shared data structures within Y.Doc
export const yEntities = ydoc.getMap<Entity>('entities')
export const yRelationships = ydoc.getMap<Relationship>('relationships')
export const yPositions = ydoc.getArray<ViewPosition>('positions')

// UndoManager for undo/redo capability
export const undoManager = new Y.UndoManager([yEntities, yRelationships, yPositions])

// Awareness (for collaborative cursors)
export const awareness = provider.awareness
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add lib/ydoc.ts
git commit -m "feat: support dynamic room switching from URL parameter"
```

---

## Chunk 2: AI Validation Integration

### Task 5: Create Validation Utilities

**Files:**
- Create: `lib/validation.ts`

- [ ] **Step 1: Create validation error handler**

```typescript
// lib/validation.ts
import type { ValidationFlag } from '@/types/graph';

export async function validateDiagramsWithAI(
  entities: Record<string, any>,
  relationships: Record<string, any>
): Promise<ValidationFlag[]> {
  try {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entities, relationships }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.flags)) {
      throw new Error('Invalid response format');
    }

    return data.flags;
  } catch (error) {
    console.error('Validation error:', error);
    return [{
      severity: 'error',
      message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }];
  }
}
```

- [ ] **Step 2: Verify file created**

```bash
test -f lib/validation.ts && echo "✓ File created"
```

- [ ] **Step 3: Commit**

```bash
git add lib/validation.ts
git commit -m "feat: add validation utilities with error handling"
```

---

### Task 6: Wire RightPanel "Run AI Check" Button

**Files:**
- Modify: `components/panels/RightPanel.tsx`

- [ ] **Step 1: Update RightPanel to use validation utilities**

Find the `runAICheck` function in RightPanel.tsx and replace with:

```typescript
import { validateDiagramsWithAI } from '@/lib/validation';

// Inside RightPanel component:
const runAICheck = async () => {
  setIsLoading(true);
  try {
    const flags = await validateDiagramsWithAI(store.entities, store.relationships);
    setValidationResults(flags);

    // Auto-dismiss empty results after 3 seconds
    if (flags.length === 0) {
      setTimeout(() => {
        setValidationResults([{ severity: 'warning', message: 'No issues found!' }]);
      }, 2000);
    }
  } finally {
    setIsLoading(false);
  }
};
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add components/panels/RightPanel.tsx lib/validation.ts
git commit -m "feat: wire RightPanel to AI validation with error handling"
```

---

## Chunk 3: Deployment Setup

### Task 7: Create Deployment Guide

**Files:**
- Create: `docs/DEPLOYMENT.md`

- [ ] **Step 1: Create deployment guide**

```markdown
# Deployment Guide: CS 2340 UML Collaboration Tool

## Prerequisites

- GitHub account with repository access
- Vercel account (free tier OK)
- Railway account (free tier OK)
- Gemini API key (from Google AI Studio)

## Step 1: Prepare Environment Variables

### For Local Development

Create `.env.local` in project root:

\`\`\`
NEXT_PUBLIC_WS_URL=ws://localhost:1234
GEMINI_API_KEY=your-gemini-api-key-here
\`\`\`

### For Production

You'll set these in the deployment platforms.

## Step 2: Deploy WebSocket Server to Railway

The Yjs WebSocket server handles real-time collaboration.

1. **Go to Railway.app**
   - Sign in / create account
   - Click "New Project"

2. **Deploy from GitHub**
   - Connect your GitHub repo
   - Select the `hackathon-2340` repository
   - Choose the root directory (/)

3. **Configure Environment**
   - Add environment variable:
     ```
     PORT=3000
     ```
   - Railway will auto-detect Node.js and run `npm start`

4. **Get WebSocket URL**
   - Once deployed, copy the deployment URL
   - It will be something like: `https://your-app-name.railway.app`
   - Change to WebSocket: `wss://your-app-name.railway.app`

5. **Note the URL**
   - You'll need this for the Next.js deployment

## Step 3: Deploy Next.js App to Vercel

1. **Go to Vercel.com**
   - Sign in with GitHub
   - Click "New Project"
   - Import your `hackathon-2340` repository

2. **Configure Build Settings**
   - Framework: Next.js (auto-detected)
   - Root Directory: ./ (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add two variables:
     ```
     NEXT_PUBLIC_WS_URL=wss://your-railway-url
     GEMINI_API_KEY=your-gemini-api-key
     ```
   - Replace placeholders with actual values

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2 min)
   - You'll get a URL like: `https://hackathon-2340.vercel.app`

## Step 4: Verify Deployment

1. **Test in Browser**
   - Visit your Vercel URL
   - Create a new room
   - Verify the room code displays

2. **Test Real-time Sync**
   - Open the app in two browser tabs/windows
   - Use the same room code
   - Add a class in one tab
   - Verify it appears in the other tab

3. **Test AI Validation**
   - Load a scenario
   - Click "Run AI Check" in the right panel
   - Verify validation results appear

## Step 5: Troubleshooting

### WebSocket Connection Fails
- Check that Railway deployment is running
- Verify `NEXT_PUBLIC_WS_URL` is correct in Vercel env vars
- Check browser console for connection errors

### AI Validation Returns Error
- Verify `GEMINI_API_KEY` is set in Vercel env vars
- Check that key is valid in Google AI Studio
- Review server logs in Vercel dashboard

### Rooms Not Syncing Across Tabs
- Verify the same room code is used
- Check Network tab in DevTools for WebSocket connection
- Confirm Railway server is still running

## Monitoring & Maintenance

### Railway Dashboard
- Monitor server health
- View logs for errors
- Check bandwidth usage (free tier: 5GB/month)

### Vercel Dashboard
- Monitor deployment status
- View build logs
- Check analytics and usage

## Scaling Considerations

For production with many users:
- Railway: Consider upgrading to paid tier for higher limits
- Vercel: Automatically scales within free tier
- Yjs: WebSocket server can handle many concurrent connections
- Consider adding Redis for persistence (Railway offers Redis)

## API Rate Limiting

Google Gemini API has rate limits. Monitor in:
- Google Cloud Console
- Gemini API Dashboard
- Server logs for 429 Too Many Requests errors
\`\`\`

- [ ] **Step 2: Verify file created**

```bash
test -f docs/DEPLOYMENT.md && echo "✓ Deployment guide created"
```

- [ ] **Step 3: Commit**

```bash
git add docs/DEPLOYMENT.md
git commit -m "docs: add comprehensive deployment guide for Vercel + Railway"
```

---

### Task 8: Update .env.local Template

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Create environment template**

```bash
cat > .env.example << 'EOF'
# WebSocket Server URL
# Local: ws://localhost:1234
# Production: wss://your-railway-deployment.railway.app
NEXT_PUBLIC_WS_URL=ws://localhost:1234

# Gemini API Key
# Get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your-api-key-here
EOF
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add .env.example template"
```

---

## Chunk 4: End-to-End Testing & Verification

### Task 9: Verify All Systems Work Together

**Files:**
- Create: `docs/VERIFICATION.md`

- [ ] **Step 1: Create verification checklist**

```markdown
# End-to-End Verification Checklist

## Local Development Testing

### 1. Lobby System
- [ ] App shows room selector on first load
- [ ] "Quick Start" creates a new random room code
- [ ] "Join Existing Room" input accepts room codes
- [ ] Room code displays in top-right after selection
- [ ] URL contains `?room=XXXX` parameter
- [ ] Navigating to URL with room code auto-joins that room

### 2. Real-time Collaboration (Multi-Client)
- [ ] Open app in two browser tabs with same room code
- [ ] Add entity in Tab A
- [ ] Entity appears in Tab B within 1 second
- [ ] Edit entity name in Tab A
- [ ] Change reflects in Tab B
- [ ] Collaborator presence shows in left panel
- [ ] Different colors assigned to each user

### 3. All Diagram Editor Features
- [ ] Can switch between UCD/DCD/SD tabs
- [ ] Add buttons work for each diagram type
- [ ] Double-click editing works on all node types
- [ ] Undo/Redo buttons work
- [ ] Connect mode toggle enables/disables edge drawing
- [ ] Playback slider appears only in SD tab
- [ ] Export button downloads PNG file

### 4. Scenarios
- [ ] Can load each pre-loaded scenario
- [ ] Scenario loads with correct entities/relationships
- [ ] Switching scenarios updates all views

### 5. AI Validation
- [ ] "Run AI Check" button is visible in right panel
- [ ] Clicking shows loading state
- [ ] Validation results appear in panel
- [ ] Results display as colored badges with messages
- [ ] No API key error messages appear (if key is set)

### 6. Traceability Tab
- [ ] "Traceability" tab appears in right panel
- [ ] Shows all entities with their diagram types
- [ ] Color-coded badges (DCD=blue, UCD=green, SD=purple)

## Production Testing (After Deployment)

### 1. Vercel Deployment
- [ ] App loads from Vercel URL
- [ ] No 404 or build errors
- [ ] UI renders correctly
- [ ] Responsive on mobile/tablet

### 2. Railway WebSocket Server
- [ ] Vercel can connect to Railway WebSocket
- [ ] Multi-client sync works across network
- [ ] No connection timeout errors

### 3. End-to-End Network Sync
- [ ] Two users in different networks, same room
- [ ] Real-time sync works without lag
- [ ] AI validation returns results (not client-side only)

### 4. Production Environment Variables
- [ ] NEXT_PUBLIC_WS_URL points to Railway
- [ ] GEMINI_API_KEY is set and valid
- [ ] No sensitive data in client-side code

## Performance Checks

### 1. Load Time
- [ ] Vercel deployment loads in <3 seconds
- [ ] No console errors on load

### 2. Network Latency
- [ ] Entity changes sync within 500ms
- [ ] No WebSocket disconnections during normal use

### 3. Memory Usage
- [ ] Large diagrams (20+ entities) don't crash
- [ ] Long sessions (30+ min) remain stable

## Security Checks

- [ ] `.env.local` is in .gitignore
- [ ] No API keys in source code
- [ ] WebSocket connection uses WSS (secure) in production
- [ ] CORS headers are correct

## Sign-Off

When all checks pass:
- [ ] Local dev fully functional
- [ ] Production deployment verified
- [ ] All systems working together
- [ ] Ready for user testing

**Date Verified:** _______________
**Tester Name:** _______________
\`\`\`

- [ ] **Step 2: Verify file created**

```bash
test -f docs/VERIFICATION.md && echo "✓ Verification guide created"
```

- [ ] **Step 3: Commit**

```bash
git add docs/VERIFICATION.md
git commit -m "docs: add end-to-end verification checklist"
```

---

### Task 10: Final Build & Test

**Files:**
- None (verification only)

- [ ] **Step 1: Build project**

```bash
npm run build 2>&1 | tail -30
```

Expected: Compiled successfully with no errors

- [ ] **Step 2: Quick functionality test**

```bash
npm run dev &
# Wait 5 seconds for server to start
curl http://localhost:3000 2>&1 | head -20
# Then kill the dev server: pkill -f "next dev"
```

Expected: HTML response with app markup

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete UML collaboration tool with lobby, validation, and deployment setup"
```

- [ ] **Step 4: Verify git log**

```bash
git log --oneline main -15
```

---

## Summary

**Features Implemented:**
- ✅ Lobby/Room system with URL-based linking
- ✅ AI Validation Engine wired to RightPanel
- ✅ Deployment guides for Vercel + Railway
- ✅ End-to-end verification checklist

**Ready For:**
1. User deploys to Vercel + Railway (following DEPLOYMENT.md)
2. User verifies systems work (following VERIFICATION.md)
3. User shares room codes with teammates
4. Multi-client real-time collaboration begins

**Files Created:** 4 (RoomSelector, rooms.ts, validation.ts, 3 docs)
**Files Modified:** 3 (page.tsx, RightPanel.tsx, ydoc.ts, TitleDisplay.tsx)
**Total Commits:** 10+
