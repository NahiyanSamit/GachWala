# Unified GachWala Project

## 📁 Single Package Structure

All dependencies and environment variables are now managed from the root directory.

## 🚀 Quick Commands

### Install Dependencies
```bash
npm install
```

### Development (Run Both)
```bash
npm run dev
```
Runs client on http://localhost:5173 and server on http://localhost:5000

### Build for Production
```bash
npm run build
```
Creates optimized build in `client/dist/`

### Run Production Server
```bash
npm start
```

## 📝 Environment Variables (`.env`)

All environment variables are in the root `.env` file:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Server
PORT=5000
JWT_SECRET=your_secret_key

# Environment
NODE_ENV=production

# Client API URL
VITE_API_URL=https://test.earthdreamsedu.com
```

**For local development:** Change `VITE_API_URL=http://localhost:5000` and `NODE_ENV=development`

**For production:** Use your production URL

## 📦 Deployment to cPanel

### 1. Build the project
```bash
npm run build
```

### 2. Upload Files

**Frontend (to domain root):**
- Upload all files from `client/dist/` to `public_html/`

**Backend (to gachwala folder):**
- Upload all files from `server/` folder
- Create `.env` file in `gachwala/` with:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Gachwala
JWT_SECRET=gachwala_super_secure_secret_key_2025
PORT=5000
NODE_ENV=production
```

### 3. Setup Node.js App in cPanel
- Application root: `gachwala`
- Application startup file: `index.js`
- Click **Restart**

### 4. Test
Visit your website and test all features!

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Run both client and server |
| `npm run dev:client` | Run client only |
| `npm run dev:server` | Run server only |
| `npm run build` | Build client for production |
| `npm start` | Start production server |

## ✅ Current Configuration

- **MongoDB:** Connected to Atlas cluster
- **JWT Secret:** gachwala_super_secure_secret_key_2025
- **API URL:** https://test.earthdreamsedu.com (production)
- **Environment:** production

Your project is ready to deploy! 🎉
