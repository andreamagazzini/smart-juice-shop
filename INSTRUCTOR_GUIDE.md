# Smart Juice Shop - Instructor Guide

## 🎓 Course Overview

Smart Juice Shop is a hands-on web security training application designed for **non-technical learners**. Students learn practical cybersecurity concepts by finding and exploiting real vulnerabilities in a safe, controlled environment.

---

## 📖 Lesson Structure Recommendations

### Session 1: Introduction & Basics (2 hours)
**Objectives**: Get comfortable with the app and browser tools

1. **Welcome & Setup** (15 min)
   - Explain what cybersecurity is
   - Show the app structure
   - Demonstrate how to open browser DevTools

2. **Hands-On Lab: Easy Challenges** (45 min)
   - Guided walkthrough of: Access Admin Section
   - Students complete: Use Default Credentials, Login Admin
   - Show how hints work and how to read challenge explanations

3. **Break** (10 min)

4. **Storage Tab Deep Dive** (30 min)
   - Explain Local Storage vs Session Storage vs Cookies
   - Show how to view and edit data
   - Hands-on: Have students explore their own data

5. **Q&A and Wrap-up** (20 min)

---

### Session 2: Authentication & Access Control (2 hours)
**Objectives**: Understand authentication vulnerabilities

1. **Review from Session 1** (15 min)
   - Quick recap of completed challenges
   - Answer any questions

2. **Authentication Concepts** (20 min)
   - What is authentication?
   - How do passwords work?
   - Why are sessions needed?

3. **Challenge: Plaintext Passwords** (25 min)
   - Guided walkthrough
   - Show why encryption matters
   - Real-world examples

4. **Challenge: Session Hijacking** (40 min)
   - Explain what session tokens are
   - Show how to copy tokens
   - Demonstrate impersonation
   - Critical security lesson!

5. **Break** (10 min)

6. **Access Control Concepts** (15 min)
   - Difference between authentication and authorization
   - Why admin panels need protection

7. **Challenge: Access Admin Section** (20 min)
   - Show the vulnerability
   - Explain why URL-based security fails

8. **Q&A and Wrap-up** (15 min)

---

### Session 3: Injection Attacks (2 hours)
**Objectives**: Learn about SQL Injection and XSS

1. **Introduction to Injection** (20 min)
   - What is code injection?
   - SQL Injection explained simply
   - XSS explained simply

2. **Challenge: Reveal VIP Products (SQL Injection)** (40 min)
   - Show how search works
   - Demonstrate SQL injection payload
   - Explain why filtering failed
   - Show real-world impact

3. **Break** (10 min)

4. **Challenge: Stored XSS** (40 min)
   - Explain what XSS is
   - Show how to inject code
   - Demonstrate execution on other users
   - Explain DOM manipulation

5. **Defense Mechanisms** (15 min)
   - Input validation
   - Output encoding
   - Content Security Policy

6. **Q&A and Wrap-up** (15 min)

---

### Session 4: Final Challenges & Review (2 hours)
**Objectives**: Complete remaining challenges and review concepts

1. **Challenge: Manipulate Price** (30 min)
   - Client-side vs server-side validation
   - Show DevTools manipulation
   - Explain why server verification is critical

2. **Challenge: View Other Users' Data** (25 min)
   - Sensitive data exposure
   - Credential management
   - Why secrets shouldn't be in code

3. **Break** (10 min)

4. **Review All Challenges** (30 min)
   - Map challenges to OWASP Top 10
   - Discuss real-world implications
   - Answer lingering questions

5. **Bonus: Try Breaking Something New** (20 min)
   - Encourage exploration
   - Can they find new vulnerabilities?
   - Fosters critical thinking

6. **Final Q&A and Course Wrap-up** (25 min)

---

## 🎯 Recommended Teaching Methods

### 1. **Guided Discovery**
Instead of giving answers immediately:
- Ask leading questions
- Let students explore first
- Guide them when stuck
- Celebrate discoveries together

### 2. **Live Demonstrations**
- Start each challenge by showing it yourself
- Use screen sharing to show DevTools
- Point out specific clues
- React authentically to "hacks"

### 3. **Collaborative Learning**
- Pair up students for complex challenges
- Encourage discussion
- Create a supportive environment where mistakes are learning opportunities

### 4. **Real-World Connections**
- After each challenge, relate it to news stories
- Share examples of companies that suffered these attacks
- Show career opportunities in cybersecurity

---

## 💡 Key Teaching Points

### Challenge-Specific Tips

#### Access Admin Section
- **Lead-in**: "What if you could access the admin area just by changing the URL?"
- **Aha moment**: When they realize URL protection isn't enough
- **Connection**: Many real sites had this problem in the past

#### Use Default Credentials
- **Lead-in**: "Most people never change the default password on routers"
- **Aha moment**: When IoT alarm disarms with `admin/12345`
- **Connection**: Default credentials are still #1 vulnerability for IoT

#### Session Hijacking
- **Lead-in**: "Ever heard of 'session tokens'? Let's see them!"
- **Aha moment**: Copying someone else's token and becoming them
- **Connection**: This is how hackers steal logged-in sessions

#### SQL Injection
- **Lead-in**: "What if the search function doesn't validate input?"
- **Aha moment**: `1=1` reveals hidden products
- **Connection**: Many real breaches started with SQL injection

#### Stored XSS
- **Lead-in**: "Can we inject JavaScript into product descriptions?"
- **Aha moment**: Alert shows for everyone viewing the product
- **Connection**: XSS attacks steal cookies and sessions

#### Manipulate Price
- **Lead-in**: "What if the checkout trusts browser prices?"
- **Aha moment**: Edit localStorage and checkout for free
- **Connection**: Server-side validation is always critical

---

## 🛠️ Technical Support

### Common Student Questions

**Q: "I can't find DevTools"**
- Show them the keyboard shortcut again
- Demonstrate on screen share
- Give them time to practice

**Q: "What does this error mean?"**
- Help them read error messages
- Use Console tab to show errors
- Explain that errors often give clues

**Q: "How do I edit localStorage?"**
- Go to Application/Storage tab
- Show them the cart object
- Demonstrate editing prices

**Q: "Where do I find session tokens?"**
- Go to Admin → Users tab
- Point out the "Session Token" column
- Show how to copy values

**Q: "The challenge isn't completing"**
- Check if they did exactly what the hint said
- Verify they're in the right place
- Sometimes refresh the page

---

## 📊 Assessment Ideas

### Formative Assessment (During Sessions)
- **Checkpoint Quizzes**: "What did we just learn?"
- **Pair Share**: "Explain XSS to your partner"
- **Quick Writes**: "In your own words, what is SQL injection?"

### Summative Assessment (End of Course)
- **Practical Exam**: Complete 3 specific challenges independently
- **Case Study**: Analyze a real-world security breach
- **Reflection Essay**: "What surprised you most about web security?"

---

## 🎁 Bonus Activities

### 1. **Security Scavenger Hunt**
Create teams and race to complete challenges

### 2. **Bug Report Writing**
Have students write formal bug reports for vulnerabilities

### 3. **Security Audit Simulation**
Role-play as security consultants reviewing the app

### 4. **Career Exploration**
Research cybersecurity careers and share findings

---

## ⚠️ Important Reminders

### Ethical Considerations
- Emphasize these techniques are for learning only
- Explain that real hacking is illegal
- Discuss responsible disclosure of vulnerabilities

### Safety & Privacy
- This app runs in students' browsers
- No data is sent to external servers
- Students can't hack each other

### Differentiation
- Provide extra hints for struggling students
- Offer extension activities for advanced students
- Be flexible with pacing

---

## 📚 Additional Resources

### For Students
- OWASP Top 10 Official Site
- PortSwigger Web Security Academy (free, excellent)
- "Web Application Security" by Andrew Hoffman

### For Instructors
- Cybersecurity Training Curriculum (free resources)
- OWASP Juice Shop official documentation
- NIST Cybersecurity Framework

---

## 🎉 Final Thoughts

Remember: The goal isn't to make students cybersecurity experts in a few sessions. It's to:

✅ Open their eyes to how the web works (and doesn't work)  
✅ Teach them to think critically about security  
✅ Inspire curiosity about cybersecurity  
✅ Build awareness for their future careers  

**Have fun teaching!** Your students are about to discover a fascinating world. 🍹🔐
