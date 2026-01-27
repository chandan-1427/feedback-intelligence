# Backend API - Feedback Management System

A modern TypeScript-based backend API built with **Hono** framework that provides AI-powered feedback analysis, clustering, and solutions generation using the Groq API.

---

## 📋 Overview

This backend serves as the core API for a comprehensive feedback management and analysis system with AI-powered insights.

**Key Capabilities:**
- User authentication with JWT-based sessions
- Feedback collection and management
- AI-powered theme analysis and categorization
- Automated clustering of similar feedback
- Intelligent solutions generation

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Hono (Lightweight HTTP framework) |
| **Runtime** | Node.js with TypeScript |
| **Database** | PostgreSQL |
| **Authentication** | JWT (JSON Web Tokens) + bcrypt |
| **AI Integration** | Groq API (LLM-powered analysis) |
| **Security** | CORS, CSRF protection, httpOnly cookies |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Groq API key

### Installation & Setup
```bash
npm install
```

Create `.env` file:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/feedback_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
```

### Running
```bash
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Start production server
```

API runs on `http://localhost:3000`

---

## 📁 Project Structure

## 📁 Project Structure

### Core Directories

#### `/src/index.ts` - Main Entry Point
- Hono server initialization
- CORS & CSRF middleware setup
- JWT authentication handler
- Global error handling
- Route registration
- Server listening (default: port 3000)

#### `/src/config/env.ts` - Environment Configuration
Centralized configuration management:
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - Token signing key
- `JWT_EXPIRES_IN` - Token expiration
- `FRONTEND_URL` - CORS allowed origin
- `GROQ_API_KEY` - AI service credentials
- `GROQ_MODEL` - LLM model selection
- Validation warnings for missing variables

#### `/src/db/` - Database Layer
- `client.ts` - PostgreSQL connection pool
- `connect.ts` - Database health verification

#### `/src/ai/` - AI Integration
- `groqClient.ts` - Groq SDK initialization
- `solutionWithGroq.ts` - Solution generation engine
- `themeWithGroq.ts` - Theme extraction & analysis

#### `/src/routes/` - API Routes
- `auth.route.ts` - Authentication endpoints
- `feedback.route.ts` - Feedback CRUD operations
- `feedbackTheme.route.ts` - Theme analysis & categorization
- `clusters.route.ts` - Feedback clustering
- `solutions.route.ts` - Solution retrieval & generation

#### `/src/utils/` - Utilities
- `jwt.ts` - Token generation & validation helpers

---

## 📦 Dependencies

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| **hono** | ^4.11.5 | HTTP framework |
| **@hono/node-server** | ^1.19.9 | Node.js server adapter |
| **groq-sdk** | ^0.37.0 | AI API client |
| **pg** | ^8.17.2 | PostgreSQL client |
| **jsonwebtoken** | ^9.0.3 | JWT handling |
| **bcrypt** | ^6.0.0 | Password hashing |
| **dotenv** | ^17.2.3 | Environment variables |

---

## 🔐 Security & Authentication

### JWT Authentication Model
- **Token Issuance**: Generated on successful sign-in
- **Storage**: httpOnly cookie named `token` (prevents XSS)
- **Protection**: All `/api/*` routes require JWT middleware
- **Validation**: Automatic via Hono middleware
- **Frontend Integration**: Must include `credentials: "include"` in requests

### Data Ownership & Privacy
- All user data scoped by authenticated `user_id`
- Queries automatically filter by user context
- Cross-user access is strictly prevented
- No data leakage between users

### Production Security
- Cookies set with `httpOnly`, `secure`, and `sameSite=none` flags
- **HTTPS required** in production environments
- CORS configured for specific frontend origin
- Designed for: Render (API) + Vercel (Frontend) deployment

---

## 📝 API Reference

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/sign-up` | User registration |
| POST | `/auth/sign-in` | User login |
| POST | `/auth/logout` | User logout |

### Feedback Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/feedback/store-feedback` | Submit single feedback |
| POST | `/api/feedback/store-bulk` | Submit multiple feedbacks |
| GET | `/api/feedback/get-feedbacks` | Retrieve all user feedbacks |
| GET | `/api/feedback/pending` | Get unreviewed feedbacks |
| GET | `/api/feedback/pending/count` | Count pending items |
| GET | `/api/feedback/stats` | Get feedback statistics |

### AI Theme Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/feedback-ai/:id/theme` | Analyze single feedback |
| POST | `/api/feedback-ai/theme/bulk` | Batch theme analysis |

### Clustering
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clusters/themes` | List all theme clusters |
| GET | `/api/clusters/themes/:theme` | Get specific cluster details |

### Solutions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/solutions/themes/:theme/generate` | Generate solutions |
| GET | `/api/solutions` | List all solutions |
| GET | `/api/solutions/themes/:theme` | Get theme-specific solutions |

---

## ✨ Key Features

- **Secure Authentication** - JWT with bcrypt password hashing
- **AI-Powered Analysis** - Groq integration for intelligent categorization
- **Feedback Management** - Full CRUD for feedback operations
- **Smart Clustering** - Automatic grouping of similar feedback
- **Solution Generation** - AI-driven actionable recommendations
- **Theme Extraction** - Automatic identification of feedback patterns
- **Data Persistence** - PostgreSQL-backed reliable storage
- **User Isolation** - Complete data segregation per user

---

## 📋 Development Notes

- Uses `tsx` for TypeScript development with hot reload
- Database queries include user context filtering
- Error handling implemented at application level
- CORS and CSRF protections enabled by default
- Environment variables validated on startup

---

## 🌐 Deployment

**Recommended Architecture:**
- **Backend**: Render or Railway (Node.js)
- **Frontend**: Vercel or Netlify (React/Vite)
- **Database**: Supabase or AWS RDS (PostgreSQL)

**Required Environment Variables** (see `.env` setup above)
- All database and API credentials must be configured
- HTTPS endpoints required for production

---

Last Updated: January 27, 2026
