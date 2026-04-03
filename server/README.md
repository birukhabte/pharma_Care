# PharmaCare Backend API

Node.js/Express backend for PharmaCare pharmacy management system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up MongoDB Atlas:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster (if you haven't already)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB Atlas configuration:
```
PORT=5000
JWT_SECRET=your_secure_secret_key_change_in_production
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pharmacare?retryWrites=true&w=majority
```

Replace:
- `<username>` with your MongoDB Atlas username
- `<password>` with your MongoDB Atlas password
- `<cluster>` with your cluster name

5. Whitelist your IP address in MongoDB Atlas:
   - Go to Network Access in Atlas
   - Click "Add IP Address"
   - Add your current IP or use 0.0.0.0/0 for development (allow from anywhere)

6. Seed the database with sample data:
```bash
npm run seed
```

## Running

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Seed database:
```bash
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Add new medicine
- `PUT /api/medicines/:id` - Update medicine
- `PATCH /api/medicines/:id` - Partial update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `DELETE /api/medicines` - Bulk delete medicines

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/dashboard/sales-trend` - Get sales trend data
- `GET /api/dashboard/top-medicines` - Get top selling medicines
- `GET /api/dashboard/recent-sales` - Get recent sales
- `GET /api/dashboard/expiry-alerts` - Get expiry alerts

### Health Check
- `GET /api/health` - API health status

## Demo Credentials

- Email: `ravi.patel@pharmacare.in` | Password: `Pharma@2026`
- Email: `meera.nair@pharmacare.in` | Password: `Staff@2026`
- Email: `arjun.sharma@pharmacare.in` | Password: `Invent@2026`

## Database Models

### User
- email, password, fullName, pharmacyName, role

### Medicine
- name, genericName, category, manufacturer, batchCount, stockQty, reorderLevel
- unitPrice, costPrice, supplier, status, dosageForm, strength
- hsnCode, gstRate, schedule

### Sale
- invoiceNo, customerName, items[], totalAmount, paymentMethod, soldBy

## MongoDB Atlas Tips

- The free tier (M0) provides 512MB storage, perfect for development
- Enable automatic backups in production clusters
- Use database users with specific permissions (not the admin user)
- Monitor your cluster usage in the Atlas dashboard
- Set up alerts for connection issues or high usage

## Notes

For production deployment:
- Use a dedicated MongoDB Atlas cluster (not free tier)
- Implement proper error handling and logging
- Add request rate limiting
- Add input sanitization
- Use environment-specific configurations
- Add API documentation (Swagger/OpenAPI)
- Implement data backup strategies
- Restrict IP whitelist to your server IPs only
