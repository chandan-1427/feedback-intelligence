# Frontend Application - Feedback Management UI

A modern, responsive React-based SPA built with **Vite**, **TypeScript**, and **Tailwind CSS** for collecting, analyzing, and managing customer feedback with AI-powered insights.

---

## 📋 Overview

This frontend application provides an intuitive interface for users to:
- Submit and manage feedback
- View AI-generated themes and insights
- Analyze feedback clusters and patterns
- Access AI-recommended solutions
- Track feedback analytics and metrics

**Key Capabilities:**
- User authentication (sign-up, sign-in, logout)
- Dashboard for feedback submission and tracking
- Insights page with advanced analytics
- Real-time data updates via React Query
- Responsive mobile-first design
- Accessible UI components

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | React 19 with TypeScript |
| **Build Tool** | Vite (Rolldown-based) |
| **Routing** | React Router v7 |
| **State Management** | TanStack React Query v5 |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Charts** | Recharts v3 |
| **Linting** | ESLint with TypeScript support |
| **Type Safety** | TypeScript ~5.9 |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Backend API running on configured URL

### Installation & Setup
```bash
npm install
```

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Running
```bash
npm run dev      # Development server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

Dev server runs on `http://localhost:5173`

---

## 📁 Project Structure

### Core Files

#### `src/main.tsx` - Application Bootstrap
- React 19 with StrictMode
- TanStack React Query setup
- Global styles initialization

#### `src/App.tsx` - Router Configuration
- Public layout routes (Landing, Sign-in, Sign-up)
- Authorized layout routes (Dashboard, Insights)
- Layout components (Navbar, Footer)
- Dark theme styling

#### `src/index.css` - Global Styles
- Tailwind CSS imports
- Custom utility classes
- Theme configuration

### 📂 `/src/pages/` - Page Components
| File | Purpose |
|------|---------|
| `LandingPage.tsx` | Public landing page / hero section |
| `SignInPage.tsx` | User login page |
| `SignUpPage.tsx` | User registration page |
| `Dashboard.tsx` | Main feedback submission & tracking |
| `DashboardOri.tsx` | Alternative dashboard layout |
| `InsightsPage.tsx` | Analytics & insights visualization |

### 📂 `/src/components/` - Reusable UI Components

#### `/components/dashboard/`
- `FeedbackComposer.tsx` - Feedback submission form
- `FeedbackList.tsx` - Displays user's feedback items
- `PendingFeedbackCountBadge.tsx` - Shows pending count
- `PendingFeedbackListCard.tsx` - List card for pending items

#### `/components/insights/`
- `BulkThemeCard.tsx` - Theme overview card
- `SolutionDetailsCard.tsx` - Detailed solution display
- `SolutionsListCard.tsx` - List of solutions
- `ThemeAnalyticsChart.tsx` - Analytics visualization
- `ThemeClusterDetailsCard.tsx` - Cluster detail view
- `ThemeClustersCard.tsx` - Cluster summary card

#### `/components/ui/`
Shared UI primitives:
- `FormAlert.tsx` - Error/success notifications
- `PasswordInput.tsx` - Secure password input
- `SubmitButton.tsx` - Form submission button
- `TextInput.tsx` - Text input field

### 📂 `/src/hooks/` - Custom React Hooks

#### `/hooks/auth/`
- `useSignUp.ts` - User registration mutation
- `useSignIn.ts` - User login mutation
- `useLogout.ts` - User logout mutation
- `useMe.ts` - Current user profile query

#### `/hooks/feedbacks/`
- `useFeedbacks.ts` - Fetch all feedbacks
- `usePendingFeedbacks.ts` - Get unreviewed feedbacks
- `usePendingFeedbackCount.ts` - Count pending items
- `useFeedbackStats.ts` - Statistics & aggregation

#### `/hooks/solutions/`
- `useSolutions.ts` - Fetch all solutions
- `useSolutionDetails.ts` - Get specific solution
- `useGenerateSolution.ts` - Generate new solutions

#### `/hooks/theme-clusters/`
- `useClusters.ts` - Fetch all theme clusters
- `useThemeSingle.ts` - Get single theme details
- `useBulkTheme.ts` - Batch theme operations

### 📂 `/src/layouts/` - Layout Components
| File | Purpose |
|------|---------|
| `Navbar.tsx` | Public layout header |
| `Footer.tsx` | Public layout footer |
| `AuthorizedNavbar.tsx` | Authenticated user header |
| `AuthorizedFooter.tsx` | Authenticated user footer |
| `UserManual.tsx` | Help/documentation component |

### 📂 `/src/lib/` - Utilities & Configuration

#### `/lib/config/env.ts`
- Environment variable validation
- API base URL configuration
- Runtime validation

#### `/lib/api/`
API client functions for backend integration:
- `auth.ts` - Authentication endpoints
- `feedback.ts` - Feedback operations
- `feedbackAi.ts` - AI analysis endpoints
- `clusters.ts` - Clustering operations
- `solutions.ts` - Solutions endpoints
- `user.ts` - User profile endpoints

#### `/lib/types/`
TypeScript type definitions:
- `auth.ts` - Auth types & interfaces
- `feedback.ts` - Feedback data structures
- `feedbackAi.ts` - AI response types
- `clusters.ts` - Cluster types
- `solutions.ts` - Solution types
- `user.ts` - User profile types

---

## 📦 Key Dependencies

### Frontend Framework
| Package | Version | Purpose |
|---------|---------|---------|
| **react** | ^19.2.0 | UI library |
| **react-dom** | ^19.2.0 | React DOM rendering |
| **react-router-dom** | ^7.12.0 | Client-side routing |

### Data Management & API
| Package | Version | Purpose |
|---------|---------|---------|
| **@tanstack/react-query** | ^5.90.20 | Server state management |

### Styling
| Package | Version | Purpose |
|---------|---------|---------|
| **tailwindcss** | ^4.1.18 | Utility-first CSS |
| **@tailwindcss/vite** | ^4.1.18 | Vite plugin for Tailwind |

### Visualization
| Package | Version | Purpose |
|---------|---------|---------|
| **recharts** | ^3.7.0 | Chart library |
| **lucide-react** | ^0.563.0 | Icon library |

### Development Tools
| Package | Purpose |
|---------|---------|
| **vite** (rolldown-vite) | Next-gen build tool |
| **typescript** | Type safety |
| **eslint** | Code linting |
| **@vitejs/plugin-react** | Fast Refresh support |

---

## 🎨 Design & Styling

### Theme
- **Dark Mode**: Dark background (#0D0E0E) with light text
- **Font**: Work Sans (via Tailwind config)
- **Color Scheme**: Professional dark theme with accent colors

### Responsive Design
- Mobile-first approach
- Tailwind CSS breakpoints
- Flexible component layouts
- Touch-friendly UI

### Component Library
- Pre-built UI components in `/components/ui/`
- Reusable form elements
- Notification system
- Button variants

---

## 🔐 Authentication & API Integration

### API Communication
- Base URL configured via `VITE_API_BASE_URL` environment variable
- Credentials included in requests (httpOnly cookie support)
- Error handling via React Query
- Automatic request/response interceptors

### Data Flow
1. User actions trigger hook calls
2. Hooks use API clients for backend calls
3. React Query caches & manages state
4. Components re-render on data updates
5. Loading/error states handled gracefully

### Type Safety
- Full TypeScript coverage
- API response types defined in `/lib/types/`
- IDE autocomplete for API calls
- Compile-time type checking

---

## 📊 Feature Breakdown

### Authentication Module
- Sign-up with email/password
- Sign-in with credentials
- Session persistence via cookies
- Logout functionality
- User profile access

### Feedback Management
- Submit individual feedback
- Bulk feedback submission
- View all user feedbacks
- Track pending feedback
- View feedback statistics

### AI-Powered Insights
- Automated theme extraction
- Feedback clustering
- Solution generation
- Analytics visualization
- Pattern recognition

### Dashboard
- Feedback composition interface
- Real-time feedback list
- Pending count tracking
- User notifications
- Data export capabilities

### Insights Page
- Theme cluster visualization
- Solution details & recommendations
- Chart-based analytics
- Bulk theme analysis
- Performance metrics

---

## 🔄 State Management

### React Query Strategy
- Automatic caching of API responses
- Background synchronization
- Refetching & invalidation
- Loading/error states
- Stale data handling

### Hook Pattern
```typescript
// Query hooks (read data)
const { data, isLoading } = useFeedbacks()

// Mutation hooks (write data)
const { mutate } = useGenerateSolution()
```

---

## 📝 Development Guide

### Component Structure
```typescript
// Functional component with hooks
export function MyComponent() {
  const { data } = useMyHook()
  
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### API Integration
```typescript
// In /lib/api/
export async function getFeedbacks() {
  const response = await fetch(`${env.API_BASE_URL}/api/feedback`)
  return response.json()
}
```

### Custom Hooks
```typescript
// In /hooks/
export function useMyData() {
  return useQuery({
    queryKey: ['myData'],
    queryFn: getMyData
  })
}
```

---

## 🚀 Deployment

### Build Output
```bash
npm run build
# Creates optimized production build in /dist
```

### Recommended Deployment
- **Provider**: Vercel, Netlify, or GitHub Pages
- **Node.js**: Not required (static build)
- **Environment**: Configure `VITE_API_BASE_URL` in production

### Performance
- Code splitting via Vite
- Tree-shaking of unused code
- CSS minification
- Image optimization
- Lazy loading of routes

---

## ✅ Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

---

## 📋 Development Notes

- Uses modern React 19 features
- TypeScript strict mode enabled
- ESLint configured for code quality
- HMR enabled for fast development
- React Query for server state
- TailwindCSS for styling
- Full type coverage expected

---

## 🔗 Integration Points

### Backend API
- Requires backend running at configured `VITE_API_BASE_URL`
- All endpoints require proper CORS setup
- Authentication via JWT cookies

### Services
- Groq API (via backend)
- PostgreSQL (via backend)
- No direct third-party API calls

---

Last Updated: January 27, 2026
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
