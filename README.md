# CodeMind-AI

CodeMind-AI is an AI developer workspace for code review, error solving, refactoring, complexity analysis, saved reports, Monaco editing, authentication, and AI chat.

## Features

- AI Code Review with quality score, suggestions, optimizations, fixes, best practices, security risks, and complexity analysis.
- AI Error Solver for error messages, stack traces, source code, corrected code, and prevention tips.
- AI Refactoring Engine for naming, modularization, redundancy reduction, and readability.
- Multi-language support: JavaScript, TypeScript, Python, Java, C++, C, Go, Rust, PHP.
- JWT authentication with register/login, profile management, and password reset token flow.
- Saved Reports Dashboard with search, download, compare, and delete actions.
- AI Chat Assistant for debugging, DSA, optimization, architecture, and interview preparation.
- Monaco Code Editor with syntax highlighting, formatting, language switching, save, and dark/light themes.
- AI Complexity Analyzer for time complexity, space complexity, inefficient loops, and recursion tips.

## Project Structure

```txt
CodeMind-AI/
  client/   React + Vite + Tailwind frontend
  server/   Express + MongoDB + Groq AI backend
```

## Requirements

- Node.js 18+
- MongoDB connection string
- Groq API key

Dependency inventory is listed in `requirements.txt`. Install packages with npm:

```bash
cd server
npm install

cd ../client
npm install
```

## Environment

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Run Locally

Start backend:

```bash
cd server
npm run dev
```

Start frontend:

```bash
cd client
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Main API Routes

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `POST /api/auth/google`

AI tools and reports:

- `GET /api/review/languages`
- `POST /api/review/analyze`
- `POST /api/review/error-solver`
- `POST /api/review/refactor`
- `POST /api/review/complexity`
- `POST /api/review/format`
- `GET /api/review/history`
- `GET /api/review/:id`
- `GET /api/review/:id/download`
- `POST /api/review/compare`
- `DELETE /api/review/:id`

Chat:

- `POST /api/chat`

## Verification

Frontend:

```bash
cd client
npm run lint
npm run build
```

Backend syntax check:

```bash
cd server
node --check server.js
```


