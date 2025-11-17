# VENU CIMS Frontend

A modern, production-ready Customer Information Management System built with React, TypeScript, and Tailwind CSS.

## Features

- **Complete Authentication Flow**: Login, registration, email verification, password reset
- **Customer Management**: Full CRUD operations with search, filters, and pagination
- **Audio Management**: Upload and playback customer audio recordings
- **User Management**: Admin dashboard for managing users (superuser only)
- **Dark/Light Theme**: Toggle between dark and light modes with persistence
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Auto token refresh and error handling
- **Excel Export**: Export customer data to Excel
- **Statistics Dashboard**: Visual analytics with Recharts
- **Toast Notifications**: User-friendly feedback for all actions
- **Form Validation**: Client-side validation with react-hook-form
- **Bulk Operations**: Select and delete multiple customers at once

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Recharts** - Charts and analytics
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Project Structure

```
src/
├── api/              # API client and endpoints
│   ├── axios.ts      # Axios instance with interceptors
│   ├── auth.ts       # Authentication API
│   ├── users.ts      # User management API
│   └── crm.ts        # Customer/CRM API
├── components/       # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Sidebar.tsx
│   ├── Navbar.tsx
│   └── ... (17 components total)
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   └── useDebounce.ts
├── layouts/          # Page layouts
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
├── pages/            # Route pages
│   ├── Auth/         # Authentication pages
│   ├── Dashboard/    # Dashboard pages
│   ├── CRM/          # Customer management
│   └── Superuser/    # Admin pages
├── store/            # Zustand state stores
│   ├── authStore.ts
│   ├── themeStore.ts
│   └── customerStore.ts
├── types/            # TypeScript type definitions
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── customer.types.ts
│   └── api.types.ts
├── utils/            # Utility functions
│   ├── cn.ts         # Classname utility
│   ├── formatDate.ts # Date formatting
│   └── constants.ts  # App constants
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on http://127.0.0.1:8000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Usage

### Default Credentials

Contact your administrator for login credentials.

### User Roles

- **Regular User**: Can manage customers and view analytics
- **Superuser**: All user permissions plus user management

### Key Pages

- `/login` - User authentication
- `/dashboard` - Main dashboard with statistics
- `/crm/customers` - Customer list with search and filters
- `/crm/customers/:id` - Customer detail view
- `/crm/customers/new` - Create new customer
- `/superuser/dashboard` - Admin dashboard
- `/superuser/users` - User management

## Development

### Code Style

- Use TypeScript for all new files
- Follow ESLint rules
- Use Tailwind CSS for styling
- Use functional components with hooks
- Keep components small and focused

### State Management

- **Local state**: `useState` for component-level state
- **Global state**: Zustand stores for app-wide state
- **Server state**: React Query could be added for caching

### API Integration

All API calls go through axios instance with:
- Automatic token injection
- Token refresh on 401 errors
- Global error handling
- Request/response interceptors

## Building for Production

```bash
# Build optimized production bundle
npm run build

# The build output will be in the 'dist' directory
# Serve with any static file server
```

## Deployment

The app can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

Make sure to:
1. Set environment variables in your hosting platform
2. Configure redirects for client-side routing
3. Enable CORS on your backend API

## Performance Optimization

- Code splitting with React.lazy()
- Image optimization
- Bundle size analysis
- Lazy loading for routes
- Debounced search inputs
- Pagination for large lists

## Security

- XSS protection via React
- CSRF tokens for state-changing operations
- Secure token storage
- Auto logout on token expiry
- Protected routes
- Input validation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For support, contact your system administrator.
