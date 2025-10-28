# Quick Reference - Challenge Cheat Sheet

> ⚠️ **Try solving challenges yourself first!** Use this only when truly stuck.

---

## 🔧 How to Open DevTools

| Browser | Method |
|---------|--------|
| Chrome/Edge | Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac) |
| Firefox | Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac) |
| Safari | Enable Developer menu first: Preferences → Advanced → Show Develop menu, then `Cmd+Option+I` |

---

## 📋 Challenge Quick Reference

### 1. Access Admin Section ⭐
**How**: Type `/admin` in the URL bar and press Enter  
**Why**: No authorization check on admin pages

---

### 2. View Other Users' Data ⭐⭐
**Where**: Admin → Settings tab  
**What to find**: Database credentials  
**How to use**: Enter credentials in Users tab modal  
**Why**: Sensitive data exposed in settings

---

### 3. View Plaintext Passwords ⭐⭐
**Where**: Admin → Users tab  
**What to do**: Click the eye icon 👁️ next to passwords  
**Why**: Passwords stored without encryption

---

### 4. Reveal VIP Products ⭐⭐
**Where**: Home page search bar  
**What to search**: `1=1` or `' OR '1'='1`  
**Why**: SQL injection bypasses VIP filter

---

### 5. Stored XSS ⭐⭐
**Where**: Admin → Products tab  
**What to inject**: `<img src=x onerror=alert(1)>`  
**Where to inject**: Product description field  
**Why**: No sanitization of user input before storage

---

### 6. Use Default Credentials ⭐
**Where**: Navigate to "IoT Controls" page  
**What to disarm**: Security System alarm  
**Credentials**: `admin` / `12345`  
**Why**: Default IoT credentials never changed

---

### 7. Login Admin ⭐
**Where**: Login page  
**Credentials**: `admin@juice-shop.com` / `admin123`  
**Why**: Admin credentials visible in user database

---

### 8. Session Hijacking ⭐⭐⭐
**Where**: Admin → Users tab  
**What to copy**: Another user's session token  
**Where to paste**: DevTools → Application → Cookies → Replace `session` cookie value  
**Then**: Refresh the page  
**Why**: Session tokens exposed in users table

---

### 9. Manipulate Price ⭐⭐⭐
**Step 1**: Add items to cart  
**Step 2**: Open DevTools → Application tab  
**Step 3**: Local Storage → Find `cart`  
**Step 4**: Edit `price` values to `0`  
**Step 5**: Refresh page and go to checkout  
**Why**: Server trusts client-side prices

---

## 🗂️ Where to Find Things

### Storage/Application Tab Structure
```
Application
├── Storage
│   ├── Local Storage
│   │   └── http://localhost:3000
│   │       ├── cart           ← Edit prices here!
│   │       └── currentUser    ← Your login info
│   └── Session Storage
│       └── ...
└── Cookies
    └── http://localhost:3000
        └── session           ← Copy tokens here!
```

### Admin Panel Tabs
- **Overview**: Statistics
- **Users**: List of users (with tokens!)
- **Products**: Edit products (XSS here!)
- **Settings**: Database credentials

---

## 💡 Common Mistakes

❌ **Don't**: Edit prices in the checkout input field  
✅ **Do**: Edit prices in localStorage BEFORE checkout

❌ **Don't**: Try to hack the search bar with complex SQL  
✅ **Do**: Simple payloads like `1=1` work best

❌ **Don't**: Forget to refresh after editing localStorage  
✅ **Do**: Always refresh to see changes take effect

❌ **Don't**: Try to login with wrong credentials first  
✅ **Do**: Check Users tab for actual credentials

---

## 🎯 Difficulty Guide

### ⭐ Easy (Start Here!)
- Access Admin Section
- Use Default Credentials  
- Login Admin

### ⭐⭐ Medium
- View Other Users' Data
- View Plaintext Passwords
- Reveal VIP Products
- Stored XSS

### ⭐⭐⭐ Hard
- Session Hijacking
- Manipulate Price

---

## 🔍 Where to Look for Credentials

| What | Where | How |
|------|-------|-----|
| Admin Login | Admin → Users tab | Email: `admin@juice-shop.com` |
| IoT Alarm | - | Username: `admin`, PIN: `12345` |
| Database | Admin → Settings tab | Copy entire credentials block |
| Session Tokens | Admin → Users tab | In "Session Token" column |

---

## 📱 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open DevTools | `F12` |
| Refresh page | `F5` or `Ctrl+R` |
| Hard refresh | `Ctrl+Shift+R` or `Cmd+Shift+R` |
| Find in page | `Ctrl+F` or `Cmd+F` |
| Copy selected | `Ctrl+C` or `Cmd+C` |
| Paste | `Ctrl+V` or `Cmd+V` |

---

## ✅ Checklist Before Asking for Help

- [ ] Did I read all the hints?
- [ ] Did I try the exact steps in the hints?
- [ ] Did I open DevTools?
- [ ] Did I check the right tab/page?
- [ ] Did I refresh after making changes?
- [ ] Did I look at the challenge explanation again?

---

## 🎓 Learning Path

1. **Exploration** → Open app, click around
2. **Easy Wins** → Complete ⭐ challenges first
3. **DevTools** → Get comfortable with browser tools
4. **Storage** → Learn localStorage and cookies
5. **Medium** → Try ⭐⭐ challenges
6. **Advanced** → Tackle ⭐⭐⭐ challenges
7. **Review** → Understand what you learned

---

**Remember**: Learning cybersecurity is like learning a new language. Start simple, practice regularly, and don't be afraid to experiment! 🍹🔐
