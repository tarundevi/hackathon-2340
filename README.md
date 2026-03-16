# CS 2340 UML Collaboration Tool

A real-time collaborative UML diagram editor with AI validation, built for CS 2340.

## Prerequisites

- Node.js 18+
- npm

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:1234
GEMINI_API_KEY=your-gemini-api-key-here
```

**Getting a Gemini API key:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click "Get API key" → "Create API key"
3. Paste the key into `.env.local`

## Running Locally

You need two terminals — one for the WebSocket server (collaboration) and one for the Next.js app.

### Terminal 1 — WebSocket server

```bash
node ws-server/server.js
```

The server starts on `ws://localhost:1234`.

### Terminal 2 — Next.js app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Real-time collaboration** — multiple users can edit diagrams simultaneously
- **AI validation** — uses Gemini to check UML diagrams for issues (requires API key)
- **Auto-layout** — automatically arranges diagram nodes
- **Minimap** — overview panel for large diagrams
- **Export** — save diagrams as images

## Hackathon Submission Packet (CS 2340)

Fill in these three links before final submission:

- Live website: `TODO_ADD_PUBLIC_URL`
- GitHub repository: `TODO_ADD_GITHUB_REPO_URL`
- Video walkthrough: `TODO_ADD_VIDEO_URL`

Requirement status:

- [x] Publicly deployable architecture documented (Vercel + Railway)
- [x] Includes all 5 required diagram types (UCD, DMD, DCD, SD, SSD)
- [x] Includes required scenario mapping (SD -> Scenario 2, SSD -> Scenario 3, DCD -> Scenario 2, UCD -> Scenarios 1/2/3)
- [x] Teaches purpose, build process, and cross-diagram connections (`/learn`)
- [x] Custom-coded implementation (Next.js + TypeScript), no site builder

Detailed evidence checklist: see `HACKATHON_REQUIREMENTS_CHECKLIST.md`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
