# Missing Challenges from OWASP Juice Shop

## Current Status: 9 Challenges vs. OWASP's 100+ Challenges

### ✅ What You Have (9 challenges)
- Broken Authentication (2)
- Injection (2)
- XSS (2)
- Broken Access Control (2)
- Improper Input Validation (1)

### ❌ What's Missing (Key Categories)

#### 1. Sensitive Data Exposure (0/19 challenges)
- **Exposed API files**
- **Client-side secrets** (API keys in source)
- **Security questions** (weak answers)
- **Email enumeration**
- **Password reset flaws**

#### 2. Cryptographic Issues (0/5 challenges)
- **Weak JWT** (already have pattern for this!)
- **Bcrypt weak hashing**
- **Reversible password storage**

#### 3. Broken Authentication (only 2/9 challenges)
- **JWT issues** (weak secrets)
- **Password reset**
- **2FA bypass**
- **Remember me cookie**
- **Session hijacking**

#### 4. Injection (only 2/11 challenges)
- **LDAP injection**
- **Command injection**
- **NoSQL injection**
- **Email injection**

#### 5. XSS (only 2/9 challenges)
- **DOM-based XSS**
- **CSP bypass**
- **Server-side XSS**
- **Template injection**

#### 6. Broken Access Control (only 2/11 challenges)
- **Horizontal privilege escalation**
- **Vertical privilege escalation**
- **Direct object references**
- **Force browsing**

#### 7. Improper Input Validation (only 1/12 challenges)
- **Mass assignment**
- **Array injection**
- **Type confusion**

#### 8. Security Misconfiguration (0/4 challenges)
- **Verbose errors**
- **Debug mode enabled**

#### 9. Vulnerable Components (0/9 challenges)
- **Old dependencies**
- **Known CVEs**

#### 10. CSRF - NEW Category (0 challenges)
- **Cross-site request forgery**

---

## 🎯 Recommended to Add (Easiest First)

### Tier 1: Easy to Implement (Can add now)

#### 1. **Verbose Error Messages** ⭐⭐⭐ Easy
- Show stack traces with sensitive data
- File paths, database info, etc.
- **Challenge**: "Expose sensitive debug information"

#### 2. **Client-Side Secrets** ⭐⭐ Easy
- API keys in JavaScript source code
- Students inspect page source
- **Challenge**: "Find an API key in the client-side code"

#### 3. **Session Management Issues** ⭐⭐⭐ Easy
- Weak session IDs
- Predictable tokens
- **Challenge**: "Bypass session authentication"

#### 4. **Email Enumeration** ⭐⭐ Easy
- Tell user if email exists or not
- Timing attacks
- **Challenge**: "Enumerate valid user emails"

#### 5. **Directory Traversal** ⭐⭐⭐ Medium
- Access files outside web root
- FTP section exploitation
- **Challenge**: "Access a confidential document"

#### 6. **Hidden Files** ⭐⭐ Easy
- Expose sensitive files (legal.md, etc.)
- **Challenge**: "Access a hidden file"

---

### Tier 2: Medium Difficulty

#### 7. **Mass Assignment** ⭐⭐⭐ Medium
- Modify user profile to change role
- Form manipulation
- **Challenge**: "Register as admin user"

#### 8. **Password Reset Flaws** ⭐⭐⭐ Medium
- Password reset with weak tokens
- Security question bypass
- **Challenge**: "Reset Bjoern's password"

#### 9. **Missing Security Headers** ⭐⭐ Easy
- No CSP, X-Frame-Options, etc.
- Clickjacking vulnerability
- **Challenge**: "Exploit clickjacking vulnerability"

#### 10. **API-only XSS** ⭐⭐⭐⭐ Hard
- XSS through API endpoints
- Bypass client-side sanitization
- **Challenge**: "Perform API-only XSS attack"

---

### Tier 3: Advanced (Requires More Work)

#### 11. **File Upload Vulnerabilities**
- Upload malicious files
- Arbitrary file write
- **Challenge**: "Overwrite legal.md file"

#### 12. **XXE (XML External Entity)**
- XML injection
- Local file disclosure
- **Challenge**: "XML External Entity injection"

#### 13. **Insecure Deserialization**
- Object manipulation
- Code execution
- **Challenge**: "Exploit insecure deserialization"

#### 14. **CSRF Attacks**
- Cross-site request forgery
- State-changing operations
- **Challenge**: "Perform CSRF attack"

---

## 📊 Comparison Summary

| Category | OWASP JS | Your App | Coverage |
|----------|----------|----------|----------|
| **Broken Authentication** | 9 | 2 | 22% ✅ |
| **Sensitive Data Exposure** | 19 | 0 | 0% ❌ |
| **Injection** | 11 | 2 | 18% ✅ |
| **XSS** | 9 | 2 | 22% ✅ |
| **Broken Access Control** | 11 | 2 | 18% ✅ |
| **Improper Input Validation** | 12 | 1 | 8% ⚠️ |
| **Cryptographic Issues** | 5 | 0 | 0% ❌ |
| **Security Misconfiguration** | 4 | 0 | 0% ❌ |
| **Other** | 50+ | 0 | 0% ❌ |

**Total: 100+ challenges vs. 9 challenges (9% coverage)**

---

## 🎓 What Would Be Most Valuable to Add?

### For Your Course Needs:

1. **Verbose Errors** ⭐⭐⭐ - Easy, teaches students about info disclosure
2. **Client-Side Secrets** ⭐⭐ - Easy, teaches source code inspection
3. **Mass Assignment** ⭐⭐⭐ - Medium, teaches parameter manipulation
4. **Session Issues** ⭐⭐⭐ - Easy, teaches authentication bypass
5. **Password Reset** ⭐⭐⭐ - Medium, teaches security question flaws

These 5 additions would bring you to **14 challenges** and cover important OWASP Top 10 categories!

Want me to implement any of these?

