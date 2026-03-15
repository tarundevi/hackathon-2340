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

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
