# Feedback Management System - Complete Documentation

A comprehensive full-stack application for collecting, analyzing, and managing customer feedback with AI-powered insights, theme extraction, and intelligent solution generation.

**Live Demo:** Coming Soon  
**Documentation:** See [Architecture Overview](#-architecture) below

---

## 🎯 Project Vision

Transform customer feedback into actionable insights through:
- ✅ Intuitive feedback collection interface
- ✅ AI-powered theme analysis and categorization
- ✅ Automated clustering of similar feedback
- ✅ Intelligent solution recommendations
- ✅ Comprehensive analytics dashboard

---

## 🏗 Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React/Vite)           │
│    - Dashboard & Insights UI            │
│    - Real-time data updates             │
│    - Responsive design                  │
└──────────────┬──────────────────────────┘
               │ HTTP/REST
               │ JWT Cookies
               │
┌──────────────▼──────────────────────────┐
│      Backend API (Hono/Node.js)         │
│    - Authentication & Authorization     │
│    - Feedback Management                │
│    - AI Integration (Groq)              │
│    - Data Processing & Clustering       │
└──────────────┬──────────────────────────┘
               │ SQL
               │
┌──────────────▼──────────────────────────┐
│      PostgreSQL Database                │
│    - User data & Sessions               │
│    - Feedback & Analytics               │
│    - Clusters & Solutions               │
└─────────────────────────────────────────┘
```

---

## 📚 Documentation

### Quick Links
- **[Backend README](./backend/README.md)** - API documentation, setup, and architecture
- **[Frontend README](./frontend/README.md)** - UI documentation, components, and development guide

### Backend Overview
- **Framework**: Hono (lightweight HTTP server)
- **Database**: PostgreSQL
- **AI Service**: Groq API (LLM-powered analysis)
- **Authentication**: JWT with httpOnly cookies
- **Key Features**: Auth, Feedback CRUD, AI Analysis, Clustering, Solutions

[→ View Full Backend Documentation](./backend/README.md)

### Frontend Overview
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (Rolldown)
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS v4
- **Visualization**: Recharts
- **Key Features**: Dashboard, Insights, Real-time updates, Responsive UI

[→ View Full Frontend Documentation](./frontend/README.md)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 18+ (for both backend and frontend)
- **PostgreSQL**: 12+ (for backend)
- **Groq API Key**: Get from [Groq Console](https://console.groq.com)

### 1️⃣ Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/feedback_db
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
```

Start backend:
```bash
npm run dev
# Backend runs on http://localhost:3000
```

### 2️⃣ Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
```

Start frontend:
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### ✅ Verify Both are Running
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Database: PostgreSQL on configured URL

---

## 🎨 Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| **Framework** | Hono |
| **Runtime** | Node.js + TypeScript |
| **Database** | PostgreSQL |
| **Authentication** | JWT + bcrypt |
| **AI** | Groq API |
| **Security** | CORS, CSRF, httpOnly Cookies |

### Frontend
| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Build** | Vite |
| **Routing** | React Router v7 |
| **State** | TanStack React Query |
| **Styling** | Tailwind CSS |
| **Charts** | Recharts |
| **Icons** | Lucide React |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **PostgreSQL** | Data persistence |
| **Groq API** | AI-powered analysis |
| **Node.js** | Backend runtime |

---

## 📋 Project Structure

```
hono-test1/
├── backend/                    # Node.js/Hono API Server
│   ├── src/
│   │   ├── index.ts           # Main entry point
│   │   ├── config/            # Configuration
│   │   ├── db/                # Database layer
│   │   ├── ai/                # Groq AI integration
│   │   ├── routes/            # API endpoints
│   │   └── utils/             # Utilities
│   ├── package.json
│   ├── tsconfig.json
│   ├── README.md              # Backend documentation
│   └── .env                   # Backend environment
│
├── frontend/                   # React/Vite SPA
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # API clients & types
│   │   ├── layouts/           # Layout components
│   │   ├── App.tsx            # Router setup
│   │   ├── main.tsx           # Bootstrap
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── README.md              # Frontend documentation
│   └── .env                   # Frontend environment
│
├── README.md                  # This file
└── .gitignore

```

---

## 🔐 Security Architecture

### Authentication Flow
```
User Login
    ↓
Sign-in Request → Backend validates credentials
    ↓
JWT Token Generated → Stored in httpOnly cookie
    ↓
Cookie auto-sent with requests (credentials: 'include')
    ↓
JWT Middleware validates on protected routes
    ↓
Request continues with user_id from token
```

### Data Privacy
- ✅ All user data scoped by `user_id`
- ✅ Database queries filter by user context
- ✅ Cross-user data access prevented
- ✅ Secure password hashing (bcrypt)
- ✅ HTTPS required in production

---

## 📊 API Overview

### Authentication
```
POST   /auth/sign-up              User registration
POST   /auth/sign-in              User login
POST   /auth/logout               User logout
```

### Feedback Management
```
POST   /api/feedback/store-feedback       Submit feedback
POST   /api/feedback/store-bulk           Bulk submission
GET    /api/feedback/get-feedbacks        List feedbacks
GET    /api/feedback/pending              Pending items
GET    /api/feedback/stats                Statistics
```

### AI Analysis
```
POST   /api/feedback-ai/:id/theme         Analyze single
POST   /api/feedback-ai/theme/bulk        Batch analysis
```

### Clustering & Solutions
```
GET    /api/clusters/themes               List clusters
GET    /api/clusters/themes/:theme        Cluster details
POST   /api/solutions/themes/:theme/gen   Generate solutions
GET    /api/solutions                     List solutions
```

[→ Full API Reference](./backend/README.md#-api-reference)

---

## 🎯 Key Features

### 🔑 Authentication & User Management
- Email/password registration
- Secure login with JWT tokens
- Session management via cookies
- User profile management
- Automatic logout

### 💬 Feedback Collection
- Single feedback submission
- Bulk feedback upload
- Feedback status tracking
- Pending feedback notifications
- Feedback statistics

### 🧠 AI-Powered Analysis
- Automatic theme extraction
- Intelligent categorization
- Sentiment analysis
- Pattern recognition
- Content summarization

### 📊 Clustering & Insights
- Automatic feedback grouping
- Theme cluster visualization
- Trend identification
- Analytics dashboard
- Export capabilities

### 💡 Solution Generation
- AI-recommended solutions
- Solution-to-feedback mapping
- Implementation guidance
- Priority ranking
- Performance tracking

---

## 🚀 Development Workflow

### 1. Setup (First Time)
```bash
# Backend setup
cd backend
npm install
# Configure .env
npm run dev

# In another terminal - Frontend setup
cd frontend
npm install
# Configure .env
npm run dev
```

### 2. Development
- **Backend**: Runs with hot reload on port 3000
- **Frontend**: Runs with HMR on port 5173
- Make changes and see them instantly

### 3. Building for Production

**Backend:**
```bash
cd backend
npm run build     # Creates dist/ folder
npm start         # Runs production build
```

**Frontend:**
```bash
cd frontend
npm run build     # Creates dist/ folder
npm run preview   # Preview production build
```

### 4. Linting & Code Quality

**Backend:**
```bash
cd backend
npm run lint      # Run TypeScript compiler
```

**Frontend:**
```bash
cd frontend
npm run lint      # Run ESLint
```

---

## 🌐 Deployment

### Recommended Stack
| Component | Recommended Platform | Alternative |
|-----------|----------------------|-------------|
| **Backend** | Render, Railway | AWS EC2, DigitalOcean |
| **Frontend** | Vercel, Netlify | AWS S3, GitHub Pages |
| **Database** | Supabase, AWS RDS | DigitalOcean Managed |

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrated to production
- [ ] HTTPS enabled on backend
- [ ] CORS configured for frontend origin
- [ ] JWT secrets rotated
- [ ] Groq API key secured
- [ ] Database backups enabled
- [ ] Error logging configured
- [ ] Monitoring enabled
- [ ] HTTPS required on all endpoints

### Deployment Example (Render + Vercel)

**Backend (Render):**
1. Connect GitHub repo to Render
2. Set environment variables
3. Deploy Node.js service
4. Note the deployed URL

**Frontend (Vercel):**
1. Connect GitHub repo to Vercel
2. Set `VITE_API_BASE_URL` to backend URL
3. Deploy
4. Configure custom domain (optional)

[→ Full Deployment Guide](./backend/README.md#-deployment)

---

## 📈 Performance

### Frontend Optimizations
- Code splitting via Vite
- Lazy-loaded routes
- React Query caching
- CSS minification
- Image optimization

### Backend Optimizations
- Connection pooling (PostgreSQL)
- Query optimization
- JWT caching
- Response compression
- Error recovery

### Database Optimizations
- Indexed queries
- Connection pooling
- Query optimization
- Regular maintenance
- Backup automation

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check Node.js version
node --version  # Should be 18+

# Check environment variables
cat .env        # All required vars present?

# Check database connection
psql $DATABASE_URL -c "SELECT NOW()"

# Check Groq API key
echo $GROQ_API_KEY
```

### Frontend Won't Connect
```bash
# Check backend is running
curl http://localhost:3000

# Check VITE_API_BASE_URL
cat .env

# Check browser console for CORS errors
# Ensure credentials: 'include' in API calls
```

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql postgresql://user:password@localhost:5432/feedback_db

# Check connection pool (backend logs)
npm run dev

# Verify DATABASE_URL format
echo $DATABASE_URL
```

---

## 📝 Development Notes

### Code Standards
- TypeScript strict mode enabled
- ESLint configured for code quality
- React Hooks for state management
- Functional components only
- Full type coverage expected

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, test locally
npm run dev

# Commit & push
git add .
git commit -m "feat: description"
git push origin feature/my-feature

# Create Pull Request
```

### Environment Separation
- **Development**: Local machines with debug output
- **Staging**: Production-like environment for testing
- **Production**: Live environment with monitoring

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Create a pull request

---

## 📚 Additional Resources

### Documentation
- [Backend API Docs](./backend/README.md)
- [Frontend Component Docs](./frontend/README.md)
- [Hono Framework](https://hono.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

### External Services
- [Groq API Docs](https://console.groq.com/docs)
- [PostgreSQL](https://www.postgresql.org)
- [React Query Docs](https://tanstack.com/query)

### Tools
- [Vite](https://vite.dev)
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org)
- [Lucide Icons](https://lucide.dev)

---

## 📞 Support

For issues, questions, or suggestions:
1. Check the relevant README (backend/frontend)
2. Review troubleshooting section
3. Check browser/server console logs
4. Open an issue on GitHub

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Team

- **Project**: Feedback Management System with AI Analysis
- **Created**: January 27, 2026
- **Status**: Active Development

---

## 🗺 Roadmap

### Phase 1 (Current) ✅
- [x] Backend API setup
- [x] Frontend UI implementation
- [x] Authentication system
- [x] Feedback collection
- [x] AI integration

### Phase 2 (Planned)
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] API rate limiting
- [ ] User roles & permissions
- [ ] Team collaboration features

### Phase 3 (Future)
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Custom reporting
- [ ] Webhooks
- [ ] Advanced AI features

---

## 📊 System Requirements

### Minimum
- Node.js 18+
- PostgreSQL 12+
- 512MB RAM
- 1GB Storage

### Recommended
- Node.js 20+
- PostgreSQL 14+
- 2GB RAM
- 10GB Storage

---

**Last Updated**: January 27, 2026

---

<div align="center">

**[🚀 Get Started Now](#-quick-start)** • **[📖 Read Docs](#-documentation)** • **[🐛 Report Issues](#-support)**

Made with ❤️

</div>
