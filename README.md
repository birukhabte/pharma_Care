# PharmaCare - Pharmacy Management System

Full-stack pharmacy management application with Next.js frontend and Node.js/Express backend.

## Project Structure

```
pharmacare/
├── pharmacare/          # Next.js frontend
│   ├── src/
│   │   ├── app/        # Pages and routes
│   │   ├── components/ # Reusable components
│   │   └── lib/        # API client and utilities
│   ├── .env            # Frontend environment variables
│   └── package.json
│
└── server/             # Express backend
    ├── src/
    │   ├── config/     # Database configuration
    │   ├── models/     # Mongoose models
    │   ├── routes/     # API routes
    │   ├── middleware/ # Auth middleware
    │   └── scripts/    # Seed scripts
    ├── .env            # Backend environment variables
    └── package.json
```

## Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install
```

Create `server/.env` file:
```env
PORT=5000
JWT_SECRET=your_secure_secret_key_change_in_production
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pharmacare?retryWrites=true&w=majority
```

Replace MongoDB Atlas credentials:
- `<username>` - your MongoDB Atlas username
- `<password>` - your MongoDB Atlas password
- `<cluster>` - your cluster name

Seed the database:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd pharmacare
npm install
```

The `pharmacare/.env` file should already contain:
```env
NEXT_PUBLIC_APP_NAME=PharmaCare
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create a database user:
   - Database Access → Add New Database User
   - Choose password authentication
   - Save username and password
4. Whitelist your IP:
   - Network Access → Add IP Address
   - Add current IP or use `0.0.0.0/0` for development
5. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Demo Credentials

After seeding the database, use these credentials to login:

| Role | Email | Password |
|------|-------|----------|
| Head Pharmacist | ravi.patel@pharmacare.in | Pharma@2026 |
| Counter Staff | meera.nair@pharmacare.in | Staff@2026 |
| Inventory Manager | arjun.sharma@pharmacare.in | Invent@2026 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Add new medicine
- `PUT /api/medicines/:id` - Update medicine
- `PATCH /api/medicines/:id` - Partial update
- `DELETE /api/medicines/:id` - Delete medicine
- `DELETE /api/medicines` - Bulk delete (body: `{ ids: [] }`)

### Dashboard
- `GET /api/dashboard/metrics` - Dashboard KPIs
- `GET /api/dashboard/sales-trend` - Sales trend data
- `GET /api/dashboard/top-medicines` - Top selling medicines
- `GET /api/dashboard/recent-sales` - Recent sales list
- `GET /api/dashboard/expiry-alerts` - Expiry alerts

## Features

- 🔐 JWT-based authentication
- 💊 Medicine inventory management
- 📊 Dashboard with real-time metrics
- 🔍 Advanced search and filtering
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🗄️ MongoDB Atlas database
- ✅ Form validation
- 🔔 Toast notifications

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form
- Sonner (toast notifications)
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- express-validator

## Development

Run both frontend and backend concurrently:

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd pharmacare
npm run dev
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas production cluster
4. Enable MongoDB authentication
5. Restrict IP whitelist
6. Add rate limiting
7. Enable HTTPS

### Frontend
1. Build the application: `npm run build`
2. Set production API URL in `.env`
3. Deploy to Vercel, Netlify, or similar
4. Configure environment variables in hosting platform

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend CORS configuration allows your frontend origin.

### MongoDB Connection
- Verify your IP is whitelisted in MongoDB Atlas
- Check username/password are correct
- Ensure connection string format is correct

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET matches between requests
- Verify token is being sent in Authorization header

## License

MIT
