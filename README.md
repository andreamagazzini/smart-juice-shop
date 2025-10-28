# Smart Juice Shop 🍹

An intentionally insecure web application for security training, built with Next.js, React, and TypeScript.

## 🎯 Purpose

This application is designed for:
- **Security Training**: Teaching students about common web vulnerabilities
- **Penetration Testing**: Practicing ethical hacking techniques
- **Code Review**: Understanding insecure coding patterns
- **Bug Bounties**: Learning how to identify and report vulnerabilities

## ⚠️ Legal Disclaimer

**THIS APPLICATION IS INTENTIONALLY INSECURE AND SHOULD NEVER BE USED IN PRODUCTION.**

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/andreamagazzini/smart-juice-shop.git
cd smart-juice-shop
```

2. Install dependencies
```bash
pnpm install
```

3. Run the development server
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000)

> **Note**: No database setup needed! The app uses browser-based storage (IndexedDB).

## 🗄️ Storage

This app uses **browser-based storage** (IndexedDB) for simplicity:
- Each browser = Separate user session
- Data lives in browser only
- No interference between users
- Perfect for educational purposes

### Manage Your Data

Visit the Challenges page (via the floating button) to:
- **🔄 Reset**: Clear all progress and start fresh
- **📥 Export**: Download your progress as JSON
- **📤 Import**: Load previously exported progress

## 🔐 Default Credentials

- **Admin**: `admin@juice-shop.com` / `admin123`
- **IoT Default Credentials**: `admin` / `12345` (for disarming security alarm)

## 🎓 Available Challenges (9 Total)

### Broken Access Control (2 challenges)
- **Access Admin Section** [Difficulty: 1]: Access the administration section without authorization
- **View Other Users' Data** [Difficulty: 2]: Access sensitive user data by entering database credentials

### Cryptographic Failures (1 challenge)
- **View Plaintext Passwords** [Difficulty: 2]: Find a password stored in plain text

### Injection (2 challenges)
- **Reveal VIP Products** [Difficulty: 2]: Use SQL injection to reveal hidden VIP products
- **Stored XSS** [Difficulty: 2]: Inject malicious code into product data

### Security Misconfiguration (1 challenge)
- **Use Default Credentials** [Difficulty: 1]: Disarm alarm with default IoT credentials

### Authentication Failures (2 challenges)
- **Login Admin** [Difficulty: 1]: Log in with the admin account
- **Session Hijacking** [Difficulty: 3]: Hijack another user's session token

### Improper Input Validation (1 challenge)
- **Manipulate Price** [Difficulty: 3]: Place an order with manipulated price

## 🏗️ Architecture

```
smart-juice-shop/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── challenges/           # Challenge leaderboard
│   │   └── users/                # User management
│   ├── admin/                    # Admin panel (vulnerable!)
│   ├── challenges/               # Challenges page
│   ├── checkout/                 # Checkout page
│   ├── iot-controls/             # IoT device controls
│   ├── login/                    # Login page
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ChallengesDrawer.tsx     # Floating challenges drawer
│   ├── Navigation.tsx            # Navigation bar
│   ├── SearchBar.tsx             # Product search
│   ├── ProductGrid.tsx           # Product display
│   ├── Toast.tsx                 # Toast notifications
│   └── ...
└── lib/                          # Utility libraries
    ├── browser-db.ts             # IndexedDB operations
    └── security.ts               # Security utilities
```

## 🔓 Implemented Vulnerabilities

### 1. SQL Injection
**Location**: `lib/browser-db.ts` - `searchProducts()` function

**Vulnerability**: String matching bypasses VIP product filtering
```typescript
if (query.includes(' OR ') || query.includes("' OR") || query.includes('1=1')) {
  return true // SQL injection - bypasses vipOnly filter!
}
```

**Exploit**: Search for `1=1` to reveal VIP products

### 2. Stored XSS (Cross-Site Scripting)
**Location**: `app/admin/page.tsx` - Product editing

**Vulnerability**: User input rendered with `dangerouslySetInnerHTML`
```typescript
<div dangerouslySetInnerHTML={{ __html: product.description }} />
```

**Exploit**: Edit a product description with `<img src=x onerror=alert(1)>`

### 3. Broken Access Control
**Location**: `app/admin/page.tsx`

**Issues**:
- Admin panel accessible at `/admin` without proper authorization checks
- Session token exposed in Users table
- Database credentials displayed in Settings tab

### 4. Session Hijacking
**Location**: `app/api/users/tokens/route.ts` - Exposes all user tokens

**Vulnerability**: Session tokens displayed in plain text
**Exploit**: Copy another user's token to impersonate them

### 5. Plaintext Passwords
**Location**: `app/admin/page.tsx` - Users tab

**Vulnerability**: Passwords stored and displayed in plain text
**Exploit**: View passwords in the admin Users table

### 6. Default Credentials
**Location**: `app/iot-controls/page.tsx` - Security alarm

**Vulnerability**: Uses default IoT credentials (`admin` / `12345`)
**Exploit**: Disarm alarm with default credentials

### 7. Price Manipulation
**Location**: `app/checkout/page.tsx`

**Vulnerability**: Trusts client-side price data
**Exploit**: Modify prices in localStorage and checkout

## 🎨 Features

- **Modern UI**: Beautiful gradient design with Tailwind CSS
- **Floating Challenges Drawer**: Access challenges from anywhere
- **Toast Notifications**: Get notified when completing challenges
- **Admin Panel**: Manage users, products, and settings
- **IoT Controls**: Simulated smart device controls
- **Product Search**: Search with SQL injection vulnerability
- **Progress Tracking**: Export/import your progress

## 🛠️ Development

### Adding New Challenges

1. Add challenge definition to `lib/browser-db.ts` in the `challenges` array
2. Implement vulnerable code in the appropriate file
3. Add challenge completion logic with `completeChallenge()` function
4. Add hints to `components/ChallengesDrawer.tsx`

### Testing

```bash
# Run linter
pnpm lint

# Type checking
pnpm exec tsc --noEmit
```

## 📊 Challenge Tracking

Challenges are tracked globally (not per user) and stored in browser IndexedDB. Progress persists across page refreshes but resets when browser data is cleared.

## 🚀 Deployment

This app can be deployed to any static hosting platform that supports Next.js:

- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Connect GitHub repository
- **Other platforms**: Build with `pnpm build`

**Note**: The app uses browser storage, so each user will have their own isolated data.

## 🤝 Contributing

This is an educational project. Feel free to:
- Report issues
- Suggest new challenges
- Submit pull requests
- Improve documentation

## 📝 License

MIT License - Use responsibly for educational purposes only.

## 🙏 Acknowledgments

- Inspired by [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## ⚠️ Security Notice

**DO NOT DEPLOY THIS APPLICATION TO PRODUCTION OR EXPOSE IT TO THE INTERNET WITHOUT PROPER ISOLATION.**

This application contains numerous security vulnerabilities intentionally included for educational purposes.
