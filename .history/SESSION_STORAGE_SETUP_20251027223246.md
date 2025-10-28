# Session Storage Setup - Educational App

## ✅ How It Works

This app uses **browser-based storage** with no real database. Perfect for educational purposes!

### Architecture

```
┌─────────────────────────────────────────────────┐
│         Browser Storage (IndexedDB)             │
│  - Each browser = Separate user session         │
│  - No interference between users               │
│  - Data lives in browser only                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│      API Routes (Simplified)                    │
│  - Login: Check against demo users              │
│  - Search: Return demo products                 │
│  - Vulnerabilities: Still exploitable!          │
└─────────────────────────────────────────────────┘
```

## 🎓 For Your Students

### Session Isolation
- **Each browser = one student**
- Different computers = no interference
- Incognito windows = fresh start
- Data persists in browser until cleared

### Data Management
- **Export**: Download progress as JSON
- **Import**: Load previous progress
- **Reset**: Clear all data and start fresh

### Vulnerabilities Available
1. ✅ SQL Injection (login & search)
2. ✅ Weak Passwords (plain text storage)
3. ✅ Broken Authentication (bypass checks)
4. ✅ XSS (stored in browser)
5. ✅ Access Control issues

## 📱 How Students Use It

### 1. Login
```
Visit: http://localhost:3000/login

Demo credentials:
- Admin: admin@juice-shop.herokuapp.com / admin123
- User: user@juice-shop.herokuapp.com / password123

SQL Injection:
- Try: ' OR '1'='1
```

### 2. View Progress
```
Visit: http://localhost:3000/score-board

See:
- Completed challenges
- Current score
- Admin controls for reset/export/import
```

### 3. Export Progress
```
Click "📥 Export Progress" button
Downloads: juice-shop-data-{timestamp}.json

Includes:
- All completed challenges
- User progress
- Products data
```

### 4. Import Progress
```
Click "📤 Import Progress" button
Select previously exported JSON file
Replaces current data with imported data
```

### 5. Reset Everything
```
Click "🔄 Reset All Data" button
Confirms before clearing
Reloads app with fresh data
```

## 🚀 Running the App

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Reset database (if needed)
npm run db:push
```

## 📂 File Structure

```
lib/
├── browser-db.ts    # Client-side IndexedDB storage
├── server-db.ts     # Server-side demo data
└── security.ts      # Vulnerable JWT/session logic

components/
├── AdminPanel.tsx   # Export/Import/Reset controls
├── SearchBar.tsx    # XSS vulnerable search
└── ...

app/api/
├── auth/login/      # SQL injection vulnerability
└── products/search/ # SQL injection vulnerability
```

## 🎯 Key Features

### ✅ What Works
- Login with demo credentials
- SQL injection attacks
- Search products
- Challenge tracking (per session)
- Export/import progress
- Reset data anytime
- No database required!

### ⚠️ What's Simulated
- Database queries (indexedDB + string matching)
- SQL injection (string pattern matching)
- User sessions (browser storage)
- Challenge completion (local tracking)

## 💡 For Instructors

### Setting Up for Class
1. **Before class**: Run `npm run dev`
2. **Give students**: http://localhost:3000 (or deploy to Vercel)
3. **Each student**: Uses their own browser/session
4. **No login required**: To start, just browse the app
5. **Reset anytime**: Use admin panel

### Exercise Ideas
1. **SQL Injection**: Login with `' OR '1'='1`
2. **XSS**: Search for `<script>alert('XSS')</script>`
3. **Weak Auth**: Check browser storage for passwords
4. **Export/Import**: Share exploit data between browsers

### Deploying to Vercel
```bash
# No database needed!
git push origin main

# Vercel will:
# 1. Build the app
# 2. Deploy it
# 3. Students can access it online
```

## 🔧 Technical Details

### No Real Database
- **Products**: Hardcoded in server-db.ts
- **Users**: Hardcoded in browser-db.ts seed
- **Challenges**: Defined in browser-db.ts seed
- **Progress**: Stored in browser IndexedDB

### Vulnerabilities Still Work
- **SQL Injection**: Server-side string pattern matching
- **XSS**: Client-side rendering without sanitization
- **Auth Bypass**: Weak validation logic
- **Data Exposure**: Everything visible in DevTools

## 📝 Summary

**Perfect for education because:**
- ✅ No database setup needed
- ✅ Each student isolated (browser-based)
- ✅ Can export/import progress
- ✅ Can reset to start fresh
- ✅ All vulnerabilities still exploitable
- ✅ Students see everything in DevTools
- ✅ Deploy to Vercel with zero config

**Not for production because:**
- ❌ Data lost on browser clear
- ❌ No shared state between browsers
- ❌ No multi-user features
- ❌ Intentional vulnerabilities
