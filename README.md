# CodeMind AI

CodeMind AI is a full-stack AI-powered developer workspace built with React, Node.js, Express, MongoDB, Groq AI, Monaco Editor, and Tailwind CSS.

It helps developers review code, solve errors, refactor applications, analyze complexity, chat with AI, and manage reports inside a modern SaaS-style interface.

---

# Live Deployment

## Frontend

https://code-mind-ai-rho.vercel.app

## Backend API

https://codemind-ai-3gd7.onrender.com

## GitHub Repository

https://github.com/riddhi191203/CodeMind-AI.gi

---

# Features

- AI Code Review
- AI Error Solver
- AI Refactoring Engine
- AI Complexity Analyzer
- Monaco Code Editor
- AI Chat Assistant
- JWT Authentication
- Password Reset Flow
- Saved Reports Dashboard
- Multi-language Support
- Professional SaaS UI
- PDF Export Support
- Dark Modern Interface
- Responsive Design

---

# Supported Languages

- JavaScript
- TypeScript
- Python
- Java
- C++
- C
- Go
- Rust
- PHP

---

# Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Monaco Editor
- React Markdown
- Axios
- React Router DOM
- Lucide React

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Groq AI SDK
- Multer
- bcrypt.js

---

# Project Structure

```txt
CodeMind-AI/
│
├── client/     React + Vite Frontend
│
└── server/     Express + MongoDB Backend
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/riddhi191203/CodeMind-AI.git

cd CodeMind-AI
```

---

# Backend Setup

## Install Dependencies

```bash
cd server

npm install
```

---

## Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key

GROQ_MODEL=llama-3.3-70b-versatile

CLIENT_URL=https://code-mind-ai-rho.vercel.app
```

---

## Run Backend

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

# Frontend Setup

## Install Dependencies

```bash
cd client

npm install
```

---

## Create `.env`

```env
VITE_API_URL=https://codemind-ai-3gd7.onrender.com
```

---

## Run Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Main API Routes

## Authentication Routes

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
POST   /api/auth/forgot-password
POST   /api/auth/reset-password/:token
```

---

## AI Review Routes

```txt
POST   /api/review/analyze
POST   /api/review/error-solver
POST   /api/review/refactor
POST   /api/review/complexity
POST   /api/review/format
```

---

## Reports Routes

```txt
GET      /api/review/history
GET      /api/review/:id
DELETE   /api/review/:id
POST     /api/review/compare
```

---

## Chat Route

```txt
POST   /api/chat
```

---

# Deployment

## Frontend Deployment

- Vercel

## Backend Deployment

- Render

## Database

- MongoDB Atlas

---

# Build Commands

## Frontend Build

```bash
npm run build
```

---

## Backend Syntax Check

```bash
node --check server.js
```

---

# Environment Variables

## Server

```env
PORT=
MONGO_URI=
JWT_SECRET=
GROQ_API_KEY=
GROQ_MODEL=
CLIENT_URL=
```

---

## Client

```env
VITE_API_URL=
```

---

# Local Development

## Start Backend

```bash
cd server
npm run dev
```

---

## Start Frontend

```bash
cd client
npm run dev
```

---

# Author

## Riddhi Jain

CodeMind AI — AI Engineering Workspace for intelligent code analysis, debugging, optimization, and developer productivity.

---

# License

MIT License