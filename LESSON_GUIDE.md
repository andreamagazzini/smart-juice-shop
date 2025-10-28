# Smart Juice Shop - Beginner's Lesson Guide

## 🌟 What is This App?

Welcome to **Smart Juice Shop** - a fun, interactive web application designed to teach you about **cybersecurity**!

Think of this app like a digital escape room, but instead of finding keys to escape, you'll be discovering and exploiting security vulnerabilities (bugs that let hackers break into websites).

### What You'll Learn

This app teaches you about the **OWASP Top 10** - the most common security risks that affect websites. But don't worry! We'll make it simple and fun.

---

## 🏪 About the Juice Shop

Smart Juice Shop is an online store that sells different types of juice. It has:

- **Home Page**: Browse and search for juices
- **Login Page**: Sign in to your account
- **Admin Panel**: Manage users, products, and settings (only admins can access this)
- **IoT Controls**: Control smart devices in the shop (lights, temperature, security alarm)
- **Checkout**: Buy your favorite juices

But here's the twist: **This shop has security problems on purpose!** Your job is to find them.

---

## 🎯 Your Mission: 9 Security Challenges

You'll complete **9 challenges** by finding and exploiting security vulnerabilities. Each challenge teaches you something important about web security.

### How Challenges Work

1. **Explore the app** - Click around, try different things
2. **Read the hints** - Each challenge has helpful hints to guide you
3. **Complete the challenge** - When you succeed, you'll see a green notification! 🎉
4. **Learn the lesson** - Read the explanation to understand what you found

---

## 📚 The 9 Challenges Explained

### 🔓 Challenge 1: Access Admin Section
**Difficulty**: ⭐ Easy

**What's wrong?** The admin area (where shop managers control everything) is supposed to be protected, but it's not!

**Your task**: Get into the admin panel without being an admin.

**Real-world impact**: Imagine if anyone could access your email admin panel or bank account settings!

---

### 🕵️ Challenge 2: View Other Users' Data
**Difficulty**: ⭐⭐ Medium

**What's wrong?** The admin panel shows sensitive database passwords that shouldn't be visible.

**Your task**: Find the database credentials in the admin settings and use them to view other users' information.

**Real-world impact**: If hackers find database passwords, they can steal all customer data!

---

### 🔐 Challenge 3: View Plaintext Passwords
**Difficulty**: ⭐⭐ Medium

**What's wrong?** Passwords are stored in plain text (like writing your password on a sticky note) instead of being encrypted.

**Your task**: Find where passwords are visible and look at them.

**Real-world impact**: If hackers break into the database, they can see everyone's passwords!

---

### 💎 Challenge 4: Reveal VIP Products
**Difficulty**: ⭐⭐ Medium

**What's wrong?** The shop has "VIP Only" products hidden from regular customers, but you can trick the search into showing them.

**Your task**: Use a clever search trick to reveal premium products that should be hidden.

**Real-world impact**: This is called "SQL Injection" - hackers can steal entire databases this way!

---

### 🚨 Challenge 5: Stored XSS (Cross-Site Scripting)
**Difficulty**: ⭐⭐ Medium

**What's wrong?** The shop allows you to enter malicious code that gets stored and executed for other users.

**Your task**: Inject a message into a product description that shows an alert when others view it.

**Real-world impact**: Hackers can steal your cookies, redirect you to fake sites, or even take control of your account!

---

### 🔑 Challenge 6: Use Default Credentials
**Difficulty**: ⭐ Easy

**What's wrong?** The smart security alarm uses the default username and password that comes with the device.

**Your task**: Disarm the security alarm using factory-default credentials.

**Real-world impact**: Many IoT devices (smart cameras, routers, etc.) never get their passwords changed!

---

### 👤 Challenge 7: Login Admin
**Difficulty**: ⭐ Easy

**What's wrong?** The admin password is too simple and easy to guess.

**Your task**: Log in as the admin user.

**Real-world impact**: Weak passwords are still one of the biggest security problems!

---

### 🎭 Challenge 8: Session Hijacking
**Difficulty**: ⭐⭐⭐ Hard

**What's wrong?** When you log in, you get a "session token" (like a temporary badge). These tokens are shown to everyone in the admin panel!

**Your task**: Copy someone else's login token and use it to become them.

**Real-world impact**: This is how hackers steal your logged-in sessions on real websites!

---

### 💰 Challenge 9: Manipulate Price
**Difficulty**: ⭐⭐⭐ Hard

**What's wrong?** The checkout trusts the prices that your browser sends, instead of checking them on the server.

**Your task**: Change prices in your browser and checkout for free (or cheaper)!

**Real-world impact**: E-commerce sites must verify prices on their servers, not trust browsers!

---

## 🎓 OWASP Top 10 Categories

Each challenge belongs to a category from the **OWASP Top 10** - the official list of web security risks:

1. **Broken Access Control** (Challenges 1-2): People can access things they shouldn't
2. **Cryptographic Failures** (Challenge 3): Sensitive data isn't protected properly
3. **Injection** (Challenges 4-5): Malicious code is injected into the system
4. **Security Misconfiguration** (Challenge 6): Default settings that aren't secure
5. **Authentication Failures** (Challenges 7-8): Problems with login and sessions
6. **Improper Input Validation** (Challenge 9): Not checking user input properly

---

## 🛠️ Tools You'll Use

### Browser Developer Tools (DevTools)

This is your main hacking tool! Here's how to open it:

- **Chrome/Edge**: Press `F12` or right-click → "Inspect"
- **Firefox**: Press `F12` or right-click → "Inspect Element"
- **Safari**: First enable Developer menu (Preferences → Advanced → Show Develop menu), then press `Option + Cmd + I`

### What Can You Do With DevTools?

1. **Console Tab**: See errors and run JavaScript code
2. **Application/Storage Tab**: View and edit data stored in your browser
3. **Network Tab**: See requests between your browser and the server
4. **Elements Tab**: Inspect and modify the webpage HTML

### Important: Storage Tab

This is where you'll edit prices and cookies:
- **Local Storage**: Persistent data (survives page refresh)
- **Session Storage**: Temporary data (cleared when browser closes)
- **Cookies**: Small pieces of data sent with requests

---

## 🚀 Getting Started Guide

### Step 1: Open the App
Go to the Smart Juice Shop URL (provided by your instructor)

### Step 2: Open Challenges
Look for the floating button in the bottom-right corner with a trophy icon 🏆
Click it to see all challenges

### Step 3: Start with Easy Challenges
Begin with the ⭐ Easy challenges:
- Access Admin Section
- Use Default Credentials
- Login Admin

### Step 4: Read the Hints
For each challenge, expand the "Hints" section to get clues

### Step 5: When You Complete a Challenge
- You'll see a green notification appear!
- Read the explanation to understand what happened
- Check the challenge list to see your progress

---

## 💡 Tips for Success

1. **Read Carefully**: Challenges often give you clues in the interface
2. **Think Outside the Box**: Standard approaches won't work for hacking challenges
3. **Use DevTools**: Your most powerful tool - explore all the tabs
4. **Check All Pages**: Vulnerabilities can be anywhere
5. **Don't Give Up**: If stuck, read the hints and try different approaches

---

## 🎯 Learning Outcomes

After completing all challenges, you'll understand:

✅ Why passwords should be encrypted  
✅ How hackers bypass login systems  
✅ Why websites shouldn't trust user input  
✅ How default passwords create vulnerabilities  
✅ Why session tokens must be protected  
✅ How client-side validation can be bypassed  

---

## ⚠️ Important Notes

### For Educational Use Only
This app is **intentionally insecure** for learning purposes. Never deploy applications with these vulnerabilities in real life!

### Real-World Application
The vulnerabilities you'll find here exist in real websites. Learning about them helps you:
- Write more secure code
- Recognize security risks
- Protect your own applications

### Have Fun!
Remember, this is a learning experience. Don't worry about breaking things - that's part of the fun! 🔓✨

---

## 📞 Need Help?

If you're stuck on a challenge:

1. Re-read the hints
2. Check the OWASP category explanation
3. Look at what data is visible in DevTools
4. Try different inputs and approaches
5. Ask your instructor for guidance

**Good luck, future security experts!** 🍹🔐
