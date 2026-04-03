# MongoDB Atlas Setup Guide

## Current Issue: Authentication Failed

The error "bad auth : authentication failed" means one of these issues:

1. **Wrong username or password**
2. **Database user doesn't exist**
3. **User doesn't have proper permissions**
4. **IP address not whitelisted**

## Step-by-Step Fix

### Option 1: Verify Existing Credentials

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your project
3. Go to **Database Access** (left sidebar)
4. Check if user `habtebiruk13_db_user` exists
5. If it exists, click **Edit** and:
   - Verify the username is exactly: `habtebiruk13_db_user`
   - Click "Edit Password" and set a NEW simple password (no special characters)
   - Example: `Pharma2026` (easy to type, no special chars)
   - Make sure "Built-in Role" is set to "Read and write to any database"
   - Click "Update User"

### Option 2: Create a New Database User

1. Go to **Database Access**
2. Click **"+ ADD NEW DATABASE USER"**
3. Choose **Password** authentication method
4. Set username: `pharmacare_user`
5. Set password: `Pharma2026` (or click "Autogenerate Secure Password" and copy it)
6. Under "Database User Privileges", select: **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Whitelist Your IP Address

1. Go to **Network Access** (left sidebar)
2. Click **"+ ADD IP ADDRESS"**
3. Either:
   - Click "ADD CURRENT IP ADDRESS" (recommended for production)
   - OR click "ALLOW ACCESS FROM ANYWHERE" and enter `0.0.0.0/0` (for development only)
4. Click **"Confirm"**

### Step 4: Get the Correct Connection String

1. Go to **Database** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select **Driver: Node.js** and **Version: 5.5 or later**
5. Copy the connection string
6. It should look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Update Your .env File

Replace the MONGODB_URI in `server/.env` with:

```env
MONGODB_URI=mongodb+srv://pharmacare_user:Pharma2026@cluster0.q9vrmmi.mongodb.net/pharmacare?retryWrites=true&w=majority&appName=Cluster0
```

**Important**: Replace:
- `pharmacare_user` with your actual username
- `Pharma2026` with your actual password
- Keep `/pharmacare` as the database name
- Keep your cluster address: `cluster0.q9vrmmi.mongodb.net`

### Step 6: Test the Connection

```bash
npm run dev
```

You should see:
```
PharmaCare API running on port 5000
MongoDB connected successfully
```

## Common Issues

### Special Characters in Password

If your password contains special characters, you need to URL encode them:

| Character | Encoded |
|-----------|---------|
| @         | %40     |
| :         | %3A     |
| /         | %2F     |
| ?         | %3F     |
| #         | %23     |
| [         | %5B     |
| ]         | %5D     |

Example: If password is `Pass@123`, use `Pass%40123`

### Still Not Working?

1. **Delete the old user** in Database Access and create a new one
2. **Use a simple password** without special characters (for testing)
3. **Wait 1-2 minutes** after creating a user (Atlas needs time to propagate changes)
4. **Check cluster is running** (not paused)
5. **Verify you're using the correct cluster** (check cluster name in Atlas)

## Quick Test Connection String

Try this test connection (create this user first in Atlas):

```env
# Username: test_user
# Password: Test1234
MONGODB_URI=mongodb+srv://test_user:Test1234@cluster0.q9vrmmi.mongodb.net/pharmacare?retryWrites=true&w=majority
```

## Need Help?

If still not working, please provide:
1. Screenshot of your Database Access page (hide password)
2. Screenshot of your Network Access page
3. The exact username you created
4. Confirm if you're using the password you set (not the old one)
