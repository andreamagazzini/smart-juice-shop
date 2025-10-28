# Browser Storage Approach for Next.js Juice Shop

## Concept: Everything in the Browser

Instead of using an external database, we can store data in the browser using:
- **localStorage** - Simple key-value storage (5-10MB limit)
- **IndexedDB** - More powerful, can store complex objects (50MB+)
- **Simulated SQL queries** - Run SQL queries against browser storage

## Why This Approach?

### Advantages ✅
- **No database hosting needed** - Works on Vercel immediately
- **See the database code** - Students can inspect everything
- **Easy reset** - One button to reset all data
- **No deployment complexity** - Just push to Vercel
- **Portable** - Students can download and run offline
- **Transparent** - All data visible in browser DevTools

### Disadvantages ⚠️
- **Per-browser data** - Each student's data is isolated
- **No shared leaderboard** - Would need server for that
- **Limited persistence** - Data lost on clear browser data
- **Size limitations** - localStorage ~5-10MB, IndexedDB ~50MB

## Architecture Design

### Layer 1: Browser Storage (Simulated Database)
```typescript
// lib/browser-db.ts
class BrowserDatabase {
  // Store in localStorage
  users: User[] = []
  products: Product[] = []
  
  // Simulate SQL queries
  query(sql: string) {
    // Parse SQL and execute against local data
  }
  
  // Vulnerable to SQL injection!
  search(query: string) {
    return this.query(`SELECT * FROM products WHERE name LIKE '%${query}%'`)
  }
}
```

### Layer 2: API Routes (For Vulnerable Endpoints)
Only keep API routes that demonstrate server-side vulnerabilities:
- SQL injection in search
- Broken authentication
- File upload flaws

### Layer 3: Client Components (For Browser Vulnerabilities)
- XSS in user input
- DOM-based vulnerabilities
- Client-side auth bypass

## What Can We Recreate?

### ✅ FULLY WORKING (70% of Juice Shop)

#### Broken Authentication (9 challenges)
- ✅ Weak password storage (store in localStorage)
- ✅ JWT manipulation (client-side token parsing)
- ✅ Session hijacking
- ✅ Logic flaws (can simulate)
- ✅ Missing 2FA validation (client-side check)

#### XSS - Cross-Site Scripting (9 challenges)
- ✅ Reflected XSS (render user input unsafely)
- ✅ Stored XSS (save to localStorage)
- ✅ DOM-based XSS (modify DOM directly)
- ✅ XSS in search results
- ✅ XSS in user profiles

#### Improper Input Validation (12 challenges)
- ✅ Negative prices (client-side validation)
- ✅ Array injection
- ✅ Mass assignment
- ✅ SQL injection (simulated with parsed queries)
- ✅ NoSQL injection (localStorage query parsing)

#### Broken Access Control (11 challenges)
- ✅ Direct object references
- ✅ Missing authorization checks
- ✅ Admin panel access (client-side check)
- ✅ Horizontal privilege escalation

#### Sensitive Data Exposure (19 challenges)
- ✅ Client-side secrets in localStorage
- ✅ API keys in source code
- ✅ Passwords in localStorage
- ✅ Debug information in console

#### Security Misconfiguration (4 challenges)
- ✅ Verbose errors in console
- ✅ Exposed file paths

#### Vulnerable Components (9 challenges)
- ✅ Outdated dependencies (can showcase)
- ✅ Known vulnerabilities (document them)

### ⚠️ PARTIALLY WORKING (20% of Juice Shop)

#### SQL Injection (11 challenges)
- ⚠️ Simulated in browser (not real SQL)
- ⚠️ Can demonstrate the pattern
- ⚠️ Won't show actual database exploitation

#### Unvalidated Redirects (2 challenges)
- ⚠️ Need to track in browser history

### ❌ NOT POSSIBLE (10% of Juice Shop)

#### Advanced Server-Side Exploits
- ❌ File system manipulation
- ❌ OS command injection
- ❌ Server-side template injection
- ❌ XXE (XML processing needs server)

## Proposed Implementation

### Option A: Pure Browser Storage (100% Client-Side)

**Benefits:**
- Works instantly on Vercel
- No backend complexity
- Students see everything

**Challenges to implement:**
- SQL query parsing in JavaScript
- Simulated user sessions
- Client-side "authentication"

### Option B: Hybrid (Browser + Minimal API)

**Browser Storage for:**
- Products catalog
- User data (simulated users)
- Challenge tracking
- Shopping cart

**API Routes only for:**
- SQL injection demonstration (simulated queries)
- File upload testing
- Server-side vulnerabilities

## Example: Browser-Based SQL Simulation

```typescript
// lib/browser-sql.ts
export class BrowserSQL {
  private data: Record<string, any[]> = {}
  
  // VULNERABLE: Direct string concatenation
  query(sql: string): any[] {
    // Parse basic SQL patterns
    if (sql.includes('SELECT * FROM User WHERE email')) {
      const match = sql.match(/email\s*=\s*'([^']+)'/);
      if (match) {
        return this.data.users?.filter(u => u.email === match[1]) || [];
      }
    }
    return [];
  }
  
  // VULNERABLE: SQL Injection
  search(query: string): any[] {
    // Directly injecting user input - VULNERABLE!
    return this.query(`SELECT * FROM Product WHERE name LIKE '%${query}%'`);
  }
}
```

Students can exploit it like:
```javascript
// SQL Injection in browser
search("' OR '1'='1")
```

## Reset Functionality

```typescript
// Reset all data
function resetDatabase() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload();
}

// Download data as JSON
function exportData() {
  const data = {
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    products: JSON.parse(localStorage.getItem('products') || '[]'),
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  // Download blob as file
}

// Load data from JSON
function importData(file) {
  // Load and populate localStorage
}
```

## Scoreboard Without Database

### Option 1: localStorage per Student
- Each student tracks their own progress
- Can view in browser DevTools
- Not shared across students

### Option 2: Client-Side Only Leaderboard
- Only shows "demo" data
- For demo purposes only

### Option 3: Share Progress Links (Advanced)
- Generate shareable links with progress
- Use URL parameters or query strings
- Students can share their progress

## Recommendation

**Go with Option B: Hybrid Approach**

1. **Browser Storage for:**
   - Products (no external DB needed)
   - User state (simulated)
   - Challenge tracking
   
2. **Keep Vulnerable API Routes for:**
   - SQL injection demonstrations
   - File upload vulnerabilities
   - Server-side auth bypasses

3. **Add:**
   - Reset button on admin panel
   - Export/import data buttons
   - Local storage persistence

**Estimated coverage: ~80% of Juice Shop challenges**

This gives you:
- ✅ Easy Vercel deployment (no database needed)
- ✅ Most vulnerabilities recreated
- ✅ Students can see and modify "database" code
- ✅ Simple reset functionality
- ✅ Portable, runs anywhere

Want me to refactor the app to use this approach?
