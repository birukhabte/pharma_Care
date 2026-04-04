# PharmaCare - Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB Atlas account configured
- Both backend and frontend dependencies installed

## Running the Application

### Option 1: Manual (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd ~/pharma_care/server
npm run dev
```
Expected output:
```
PharmaCare API running on port 5000
MongoDB connected successfully
```

**Terminal 2 - Frontend:**
```bash
cd ~/pharma_care/pharmacare
npm run dev
```
Expected output:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

### Option 2: Using tmux (Run both in one terminal)

```bash
# Install tmux if not installed
sudo apt-get install tmux

# Start tmux session
tmux new -s pharmacare

# Split terminal horizontally
Ctrl+b then "

# In top pane - run backend
cd ~/pharma_care/server && npm run dev

# Switch to bottom pane
Ctrl+b then ↓

# In bottom pane - run frontend
cd ~/pharma_care/pharmacare && npm run dev

# To detach: Ctrl+b then d
# To reattach: tmux attach -t pharmacare
```

## Access the Application

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:5000/api/health

## First Time Setup

### 1. Seed the Database (One time only)
```bash
cd ~/pharma_care/server
npm run seed
```

### 2. Login with Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Head Pharmacist | ravi.patel@pharmacare.in | Pharma@2026 |
| Counter Staff | meera.nair@pharmacare.in | Staff@2026 |
| Inventory Manager | arjun.sharma@pharmacare.in | Invent@2026 |

## Troubleshooting

### Backend won't start
- Check MongoDB connection in `server/.env`
- Verify MongoDB Atlas user credentials
- Check if port 5000 is available: `lsof -i :5000`

### Frontend won't start
- Check if backend is running first
- Verify `pharmacare/.env` has correct API URL
- Check if port 3000 is available: `lsof -i :3000`

### Can't login
- Make sure backend is running
- Check browser console for errors (F12)
- Verify you ran `npm run seed` to create demo users

### API errors
- Open browser DevTools (F12) → Network tab
- Check if API calls are reaching http://localhost:5000
- Verify CORS is not blocking requests

## Stopping the Application

**Terminal 1 (Backend):**
```
Ctrl + C
```

**Terminal 2 (Frontend):**
```
Ctrl + C
```

## Development Tips

- Backend auto-reloads on file changes (nodemon)
- Frontend auto-reloads on file changes (Next.js)
- Check backend logs in Terminal 1
- Check frontend logs in Terminal 2
- Use browser DevTools for frontend debugging

## Production Build

### Backend
```bash
cd ~/pharma_care/server
npm start
```

### Frontend
```bash
cd ~/pharma_care/pharmacare
npm run build
npm start
```
