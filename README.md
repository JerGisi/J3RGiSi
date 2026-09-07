# Orbit AI

A minimal AI chatbot built with React, Vite, Node.js, and Express. The browser talks to the local Express API, which forwards messages to OpenAI without exposing credentials to the client.

## Setup

Requires Node.js 18+ and an OpenAI API key.

```bash
npm install
cp .env.example .env
```

Add your key to `.env` as `OPENAI_API_KEY`. Never commit `.env` or put the key in frontend code.

## Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API health check is at `http://localhost:3001/api/health`.

## Production build

```bash
npm run build
npm start
```

`npm start` runs the API server. Serve the generated `dist` directory with your preferred static host and set `CLIENT_ORIGIN` to that host. The API accepts the latest 20 messages and limits each message to 8,000 characters.
