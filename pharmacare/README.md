# PharmaCare Frontend

Modern, responsive pharmacy management frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## 📸 Application Screenshots

### Login Screen
![Login Screen](./public/assets/readme%20/pharmalogin.png)

### Dashboard
![Dashboard](./public/assets/readme%20/pharmadashboard.png)

### Sales Management
![Sales Management](./public/assets/readme%20/pharmasales.png)

### Inventory Management
![Inventory](./public/assets/readme%20/pharmainventory.png)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Pharmacist, Cashier, Inventory Manager)
- Secure session management
- Demo credentials for quick testing

### 💊 Medicine Management
- Complete CRUD operations
- Batch tracking with expiry dates
- Stock level monitoring
- Low stock alerts
- Advanced search and filtering
- Bulk operations

### 📊 Dashboard
- Real-time metrics and KPIs
- Sales trend visualization
- Recent transactions
- Expiry alerts
- Role-based dashboard views

### 🛒 Sales & Orders
- Point-of-sale interface
- Order creation and management
- Multiple payment methods (Cash, Card, Mobile Money)
- Receipt generation
- Sales analytics and reports

### 📈 Reports & Analytics
- Sales reports with period filters (7/30/90 days, custom range)
- Inventory reports
- Expiry reports
- Payment method breakdown
- Cashier performance tracking

### 🔔 Real-time Notifications
- Order notifications for cashiers
- Payment completion alerts for admins
- Low stock warnings
- Expiry alerts
- Auto-refresh every 10 seconds
- Mark as read functionality

### 👥 User Management
- User creation and management
- Role assignment
- Status management (Active/Inactive)
- Password management

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form
- **Notifications:** Sonner
- **Icons:** Lucide React
- **HTTP Client:** Fetch API
- **State Management:** React Hooks

## 📁 Project Structure

```
pharmacare/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── dashboard/               # Dashboard page
│   │   │   └── components/          # Dashboard components
│   │   ├── medicine-management/     # Medicine inventory
│   │   ├── sales/                   # Sales/POS page
│   │   ├── inventory/               # Inventory overview
│   │   ├── reports/                 # Reports & analytics
│   │   │   └── components/          # Report components
│   │   ├── notifications/           # Notifications page
│   │   ├── users/                   # User management
│   │   ├── customers/               # Customer management
│   │   ├── suppliers/               # Supplier management
│   │   ├── prescriptions/           # Prescription management
│   │   ├── settings/                # Settings page
│   │   └── sign-up-login-screen/    # Authentication
│   ├── components/                   # Shared components
│   │   ├── ui/                      # UI components
│   │   ├── AppLayout.tsx            # Main layout wrapper
│   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   └── Topbar.tsx               # Top navigation bar
│   ├── lib/                         # Utilities
│   │   ├── api.ts                   # API client
│   │   ├── auth.ts                  # Auth utilities
│   │   └── permissions.ts           # Permission checks
│   ├── hooks/                       # Custom React hooks
│   └── styles/                      # Global styles
├── public/                          # Static assets
│   └── assets/
│       ├── images/                  # App images
│       └── readme/                  # README screenshots
├── .env                            # Development environment
├── .env.production                 # Production environment
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running (see `../server/README.md`)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Create `.env` file:
```env
NEXT_PUBLIC_APP_NAME=PharmaCare
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

For production, create `.env.production`:
```env
NEXT_PUBLIC_APP_NAME=PharmaCare
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

3. **Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or `http://localhost:5173` if using Vite port)

### Build for Production

```bash
npm run build
npm start
```

## 🔑 Demo Credentials

After seeding the backend database, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Administrator | admin@pharmacare.et | Pharma@2026 |
| Pharmacist | tigist.haile@pharmacare.et | Staff@2026 |
| Inventory Manager | dawit.tesfaye@pharmacare.et | Invent@2026 |
| Cashier | meron.bekele@pharmacare.et | Cashier@2026 |

## 🎨 UI Components

### Form Components
- Text inputs with validation
- Select dropdowns
- Date pickers
- Checkboxes and radio buttons
- File uploads

### Data Display
- Tables with sorting and filtering
- Cards and metrics
- Charts and graphs
- Lists and grids

### Feedback
- Toast notifications
- Loading states
- Error messages
- Success confirmations
- Empty states

### Navigation
- Sidebar navigation
- Breadcrumbs
- Tabs
- Pagination

## 🔐 Role-Based Access Control

### Admin
- Full system access
- User management
- All reports and analytics
- System settings

### Pharmacist
- Medicine management
- Order creation
- Inventory management
- Sales reports
- Prescription management

### Cashier
- Order completion
- Payment processing
- View pending orders
- Basic sales reports

### Inventory Manager
- Inventory management
- Stock level monitoring
- Expiry tracking
- Inventory reports

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Key Features Implementation

### Real-time Notifications
- Notification bell in topbar with unread count
- Auto-refresh every 10 seconds
- Manual refresh button
- Mark as read functionality
- Notification categories and priorities
- Click to navigate to relevant page

### Period Filters (Reports)
- Last 7 Days
- Last 30 Days
- Last 90 Days
- Custom Date Range with date pickers
- Applies to all report types

### Dashboard Role-Based Views
- Metrics visible to Admin and Pharmacist only
- Sales visible to Admin, Pharmacist, and Cashier
- Inventory visible to Admin, Pharmacist, and Inventory Manager
- Dynamic layout based on permissions

## 🐛 Troubleshooting

### API Connection Issues

**Problem:** "Failed to fetch" errors

**Solution:**
1. Verify backend is running
2. Check `NEXT_PUBLIC_API_URL` in `.env`
3. Ensure CORS is configured on backend
4. Check browser console for detailed errors

### Authentication Issues

**Problem:** "Access denied" or automatic logout

**Solution:**
1. Clear browser localStorage
2. Logout and login again
3. Check token expiration
4. Verify backend JWT_SECRET

### Build Errors

**Problem:** TypeScript or build errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 📦 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Import to Vercel**
3. **Configure:**
   - Root Directory: `pharmacare`
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: Your backend URL
5. **Deploy**

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

## 🔧 Configuration

### Theme Customization

Edit `tailwind.config.js` to customize colors, fonts, and spacing.

### API Client

The API client is located in `src/lib/api.ts`. It handles:
- Authentication headers
- Error handling
- Request/response formatting
- Token management

### Permissions

Role-based permissions are defined in `src/lib/permissions.ts`.

## 📚 Additional Documentation

- **Backend Setup:** See `../server/README.md`
- **Deployment Guide:** See `../DEPLOYMENT_COMPLETE_GUIDE.md`
- **Theme Guide:** See `./THEME_CONSISTENCY_GUIDE.md`
- **Notification System:** See `../server/NOTIFICATION_SYSTEM.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for modern pharmacy management**
