# Salt & Light Frontend

A modern, responsive React application for the Salt & Light Christian blogging platform, built with TypeScript, Vite, and Tailwind CSS.

## 🌟 Features

### Core Functionality
- **Landing Page**: Beautiful homepage with trending posts and community features
- **Authentication**: Complete auth flow with login, registration, and password reset
- **User Dashboard**: Coming soon dashboard for user management
- **Profile Management**: User profile pages with settings
- **Community Features**: Prayer wall, comments, and notifications
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features
- **Modern React**: Built with React 18 and TypeScript
- **Fast Development**: Vite for lightning-fast development and builds
- **Styling**: Tailwind CSS for utility-first styling
- **Routing**: React Router for client-side navigation
- **Icons**: Lucide React for beautiful, consistent icons
- **API Integration**: Seamless backend API communication
- **Authentication**: JWT token-based authentication
- **State Management**: Local state with React hooks

## 🛠️ Technology Stack

- **Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Routing**: React Router DOM 7.8.2
- **Icons**: Lucide React 0.344.0
- **Linting**: ESLint 9.9.1
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 16+ 
- npm 8+
- Backend API running (see backend README)

## 🚀 Installation

### 1. Navigate to Frontend Directory
```bash
cd dayLight.build/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Salt & Light
VITE_APP_VERSION=1.0.0
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthForm.tsx     # Authentication forms
│   │   ├── ComingSoon.tsx   # Coming soon placeholder
│   │   ├── Footer.tsx       # Site footer
│   │   └── Navbar.tsx        # Navigation bar
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   │   ├── login.tsx    # Login page
│   │   │   ├── register.tsx # Registration page
│   │   │   ├── reset-password.tsx # Password reset
│   │   │   └── verify-email.tsx   # Email verification
│   │   ├── coming-soon/     # Feature pages
│   │   │   ├── dashboard.tsx    # User dashboard
│   │   │   ├── profile.tsx      # User profile
│   │   │   ├── comments.tsx     # Comments section
│   │   │   ├── notifications.tsx # Notifications
│   │   │   └── fund.tsx         # Funding page
│   │   ├── index.tsx        # Landing page
│   │   ├── home.tsx         # Home page
│   │   └── 404.tsx          # Not found page
│   ├── services/            # API services
│   │   └── apiService.js    # API client
│   ├── utils/               # Utility functions
│   │   └── theme.ts         # Theme configuration
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── eslint.config.js        # ESLint configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#1e40af) - Trust and faith
- **Secondary**: Yellow (#eab308) - Light and hope
- **Accent**: Gradient from blue to yellow
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable font stack
- **Responsive**: Scales appropriately across devices

### Components
- **Buttons**: Consistent button styles with hover effects
- **Cards**: Clean card layouts for content
- **Forms**: Accessible form components
- **Navigation**: Responsive navigation with mobile menu

## 🔐 Authentication

### Features
- **JWT Tokens**: Secure token-based authentication
- **Persistent Login**: Tokens stored in localStorage
- **Auto-logout**: Automatic logout on token expiration
- **Protected Routes**: Route protection based on auth status

### Auth Flow
1. User registers/logs in
2. Backend returns JWT tokens
3. Tokens stored in localStorage
4. API requests include Authorization header
5. Automatic token refresh when needed

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- **Touch-friendly**: Large touch targets
- **Swipe Navigation**: Mobile-optimized navigation
- **Responsive Images**: Optimized for different screen sizes
- **Fast Loading**: Optimized for mobile networks

## 🚀 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Production
```bash
npm run build        # Create production build
npm run preview      # Preview production build locally
```

## 🔧 Configuration

### Vite Configuration
- **Fast HMR**: Hot module replacement for development
- **TypeScript**: Full TypeScript support
- **Path Aliases**: Clean import paths
- **Environment Variables**: Secure environment handling

### Tailwind Configuration
- **Custom Colors**: Brand-specific color palette
- **Responsive Design**: Mobile-first approach
- **Component Classes**: Reusable component styles
- **Dark Mode**: Ready for dark mode implementation

### TypeScript Configuration
- **Strict Mode**: Strict type checking
- **Path Mapping**: Clean import paths
- **React Support**: Full React TypeScript support
- **ESLint Integration**: TypeScript-aware linting

## 🌐 API Integration

### API Service
The `apiService.js` provides a clean interface for backend communication:

```javascript
// GET request
const posts = await apiService.get('posts/');

// POST request
const newPost = await apiService.post('posts/', postData);

// PUT request
const updatedPost = await apiService.put(`posts/${id}/`, postData);

// DELETE request
await apiService.delete(`posts/${id}/`);
```

### Error Handling
- **Global Error Handling**: Consistent error handling across the app
- **User Feedback**: User-friendly error messages
- **Network Errors**: Graceful handling of network issues
- **Validation Errors**: Form validation feedback

## 🎯 Key Pages

### Landing Page (`/`)
- **Hero Section**: Compelling call-to-action
- **Trending Posts**: Featured community content
- **Verse of the Day**: Daily inspiration
- **Quick Links**: Easy navigation to key features

### Authentication Pages
- **Login** (`/auth/login`): User authentication
- **Register** (`/auth/register`): New user registration
- **Reset Password** (`/auth/reset-password`): Password recovery
- **Verify Email** (`/auth/verify-email`): Email verification

### Coming Soon Pages
- **Dashboard** (`/dashboard`): User dashboard (coming soon)
- **Profile** (`/profile`): User profile management (coming soon)
- **Comments** (`/comments`): Community comments (coming soon)
- **Notifications** (`/notifications`): User notifications (coming soon)
- **Fund** (`/fund`): Funding and donations (coming soon)

## 🧪 Testing

### Testing Setup
```bash
# Install testing dependencies (when added)
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

### Testing Strategy
- **Unit Tests**: Component testing
- **Integration Tests**: API integration testing
- **E2E Tests**: Full user flow testing
- **Accessibility Tests**: A11y compliance testing

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Server**: Nginx, Apache

### Environment Variables
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Salt & Light
VITE_APP_VERSION=1.0.0
```

## 🔍 Performance Optimization

### Build Optimizations
- **Code Splitting**: Automatic code splitting with Vite
- **Tree Shaking**: Unused code elimination
- **Minification**: Production code minification
- **Asset Optimization**: Image and asset optimization

### Runtime Optimizations
- **Lazy Loading**: Component lazy loading
- **Memoization**: React.memo for performance
- **Bundle Analysis**: Bundle size monitoring
- **Caching**: Strategic caching implementation

## 🎨 Customization

### Theme Customization
- **Colors**: Update Tailwind color palette
- **Typography**: Custom font configurations
- **Components**: Reusable component library
- **Layouts**: Flexible layout system

### Brand Customization
- **Logo**: Update logo and branding
- **Colors**: Brand-specific color schemes
- **Content**: Customize text and messaging
- **Images**: Brand-specific imagery

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

### Code Standards
- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Testing**: Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Community**: Join the community forum

### Common Issues
- **Build Errors**: Check Node.js version and dependencies
- **API Errors**: Verify backend is running and accessible
- **Styling Issues**: Check Tailwind configuration
- **TypeScript Errors**: Ensure proper type definitions

## 🔄 Version History

- **v1.0.0**: Initial release with core features
- **v1.1.0**: Added authentication flow
- **v1.2.0**: Enhanced responsive design
- **v1.3.0**: Added coming soon pages

## 🚀 Future Features

### Planned Enhancements
- **Real-time Updates**: WebSocket integration
- **Offline Support**: Progressive Web App features
- **Dark Mode**: Theme switching capability
- **Advanced Search**: Enhanced search functionality
- **Push Notifications**: Browser notification support

---

**Built with ❤️ for the Christian community**