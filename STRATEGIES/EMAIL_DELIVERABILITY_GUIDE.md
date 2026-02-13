# 📧 EMAIL DELIVERABILITY GUIDE - Keep Your Emails Out of Spam

**Your strategy: Make 20 sites for businesses with bad sites and sell them through email.**

**This guide ensures your emails actually reach their inbox, not spam.**

---

## 🎯 THE PROBLEM

**Why Emails Go to Spam:**
1. No email authentication (SPF, DKIM, DMARC)
2. Spam trigger words in subject/body
3. Poor sender reputation
4. Sending too many emails too fast
5. Low engagement (high bounce rate, no replies)
6. Using free email services (Gmail, Yahoo) for business
7. No unsubscribe link (CAN-SPAM violation)

---

## ✅ SOLUTION: 7-Step Setup (Do This First)

### **Step 1: Get a Professional Email Domain**

**❌ DON'T USE:**
- Gmail.com
- Yahoo.com
- Outlook.com
- Hotmail.com

**✅ DO USE:**
- Your own domain: `oliver@oliverseo.com`
- Or: `hello@oliverseo.com`
- Or: `contact@oliverseo.com`

**Why:** Free email services have lower deliverability rates. Your own domain = professional + better inbox placement.

**How to Set Up:**
1. Buy domain (if you don't have one): Namecheap, GoDaddy, Cloudflare
2. Set up email hosting:
   - **Google Workspace** ($6/month) - Easiest
   - **Microsoft 365** ($6/month)
   - **Zoho Mail** (Free for 1 user)
   - **ProtonMail** (Paid plans)
   - **Cloudflare Email Routing** (Free, but limited)

**Recommendation:** Google Workspace - easiest setup, best deliverability.

---

### **Step 2: Set Up Email Authentication (CRITICAL)**

**This is the #1 reason emails go to spam. Do this immediately.**

#### **A. SPF Record (Sender Policy Framework)**

**What it does:** Tells email servers you're allowed to send from your domain.

**How to Set Up:**
1. Go to your domain's DNS settings
2. Add a TXT record:
   - **Name:** `@` (or your domain)
   - **Value:** `v=spf1 include:_spf.google.com ~all` (if using Google Workspace)
   - **Value:** `v=spf1 include:spf.protection.outlook.com ~all` (if using Microsoft 365)

**For Google Workspace:**
```
v=spf1 include:_spf.google.com ~all
```

**For Microsoft 365:**
```
v=spf1 include:spf.protection.outlook.com ~all
```

**For Zoho:**
```
v=spf1 include:zoho.com ~all
```

**Test it:** Use [MXToolbox SPF Checker](https://mxtoolbox.com/spf.aspx)

---

#### **B. DKIM Record (DomainKeys Identified Mail)**

**What it does:** Cryptographically signs your emails to prove they're from you.

**How to Set Up:**

**Google Workspace:**
1. Go to Google Admin Console
2. Apps → Google Workspace → Gmail
3. Authenticate email → Generate new record
4. Copy the TXT record
5. Add to your DNS (usually something like `google._domainkey`)

**Microsoft 365:**
1. Go to Microsoft 365 Admin Center
2. Settings → Domains → Your domain
3. DNS records → Add DKIM record
4. Copy and add to DNS

**Test it:** Use [MXToolbox DKIM Checker](https://mxtoolbox.com/dkim.aspx)

---

#### **C. DMARC Record (Domain-based Message Authentication)**

**What it does:** Tells email servers what to do if SPF/DKIM fail.

**How to Set Up:**
1. Add TXT record to DNS:
   - **Name:** `_dmarc`
   - **Value:** `v=DMARC1; p=none; rua=mailto:your-email@oliverseo.com`

**Start with `p=none` (monitoring mode) for 2 weeks, then change to:**
```
v=DMARC1; p=quarantine; rua=mailto:your-email@oliverseo.com
```

**After 1 month, if everything looks good:**
```
v=DMARC1; p=reject; rua=mailto:your-email@oliverseo.com
```

**Test it:** Use [MXToolbox DMARC Checker](https://mxtoolbox.com/dmarc.aspx)

---

### **Step 3: Warm Up Your Email Account (CRITICAL)**

**New email accounts = spam risk. Warm up for 2-4 weeks before cold emailing.**

**What is Warming Up?**
- Gradually increase email volume
- Send to real people who will reply
- Build positive sender reputation

**Warming Up Schedule:**

**Week 1:**
- Day 1-2: Send 5 emails to friends/family (ask them to reply)
- Day 3-4: Send 10 emails
- Day 5-7: Send 15 emails

**Week 2:**
- Day 8-10: Send 20 emails
- Day 11-14: Send 30 emails

**Week 3:**
- Day 15-17: Send 40 emails
- Day 18-21: Send 50 emails

**Week 4:**
- Day 22-24: Send 60 emails
- Day 25-28: Send 70-80 emails

**After 4 weeks:** You can send 100+ emails/day safely.

**Tools for Warming Up:**
- **Lemwarm** (automated warming)
- **Warmbox** (automated warming)
- **Mailwarm** (automated warming)
- **Or do it manually** (send to friends, ask them to reply)

**Cost:** $10-30/month for automated tools, or free if you do it manually.

---

### **Step 4: Use Professional Email Service (Not Gmail)**

**For Cold Email, Use:**
- **Google Workspace** (if sending < 500/day)
- **Microsoft 365** (if sending < 500/day)
- **SendGrid** (for higher volume)
- **Mailgun** (for higher volume)
- **Amazon SES** (cheapest, but more technical)

**For 20 emails/day:** Google Workspace is perfect.

**For 100+ emails/day:** Consider SendGrid or Mailgun.

---

### **Step 5: Write Spam-Free Email Content**

**❌ SPAM TRIGGER WORDS (Avoid These):**
- Free
- Act now
- Limited time
- Click here
- Buy now
- Special promotion
- Winner
- Congratulations
- Urgent
- Guarantee
- No risk
- Make money
- $$$, !!!, ALL CAPS

**✅ GOOD SUBJECT LINES:**
- "Quick question about [Business Name]'s website"
- "I noticed [Business Name]'s website"
- "Website question for [Business Name]"
- "Following up on [Business Name]"
- "Question about your website"

**✅ GOOD EMAIL BODY:**
- Personalize (use their name, business name)
- Keep it short (3-4 paragraphs max)
- No excessive links (1-2 max)
- No attachments (unless they expect it)
- Professional tone
- Ask a question (encourages reply)

**Example Good Email:**
```
Subject: Quick question about Joe's Pizza's website

Hi Joe,

I noticed Joe's Pizza's website is a bit outdated. I help local restaurants get 3-5x more online orders with modern websites.

Would you be open to a quick 10-minute call? I can show you how to get more customers online.

Check out my work: oliverseo.com

Best,
Oliver
```

---

### **Step 6: Follow Best Practices**

**Email Sending:**
- **Start slow:** 20 emails/day for first week
- **Gradually increase:** Add 10 emails/day each week
- **Max safe volume:** 100-200 emails/day (from one account)
- **Space out sends:** Don't send 20 emails in 1 minute
- **Best times:** 9-11 AM, 2-4 PM (recipient's timezone)

**Email Content:**
- **Personalize every email** (name, business name, specific detail)
- **Keep it short** (under 200 words)
- **One clear call-to-action**
- **Include unsubscribe link** (required by CAN-SPAM)
- **Include your physical address** (required by CAN-SPAM)

**CAN-SPAM Requirements:**
1. ✅ Don't use false/misleading headers
2. ✅ Don't use deceptive subject lines
3. ✅ Include your physical address
4. ✅ Include unsubscribe link
5. ✅ Honor unsubscribe requests within 10 days

**Example Footer (CAN-SPAM Compliant):**
```
---
Oliver
OliverSEO
[Your Physical Address]
[City, State ZIP]

Unsubscribe: [link] | View online: [link]
```

---

### **Step 7: Monitor Your Reputation**

**Check These Regularly:**

1. **Sender Score** (https://www.senderscore.org/)
   - Should be 80+ (out of 100)
   - Check weekly

2. **Blacklist Check** (https://mxtoolbox.com/blacklists.aspx)
   - Make sure you're not on any blacklists
   - Check weekly

3. **Email Deliverability Test**
   - Send test email to: mail-tester.com
   - Should score 9/10 or 10/10
   - Check before starting campaign

4. **Bounce Rate**
   - Keep under 2%
   - If higher, verify email addresses better

5. **Reply Rate**
   - Aim for 5-10% reply rate
   - Higher = better reputation

---

## 🚀 QUICK SETUP CHECKLIST

### **Before Sending Any Emails:**

- [ ] Set up professional email domain (oliver@oliverseo.com)
- [ ] Set up SPF record (test it)
- [ ] Set up DKIM record (test it)
- [ ] Set up DMARC record (test it)
- [ ] Warm up email account (2-4 weeks)
- [ ] Test deliverability (mail-tester.com - should be 9/10+)
- [ ] Check sender score (should be 80+)
- [ ] Check blacklist status (should be clean)
- [ ] Write spam-free email templates
- [ ] Add CAN-SPAM compliant footer

---

## 📧 EMAIL TEMPLATE (Spam-Free)

**Subject:** Quick question about [Business Name]'s website

**Body:**
```
Hi [First Name],

I noticed [Business Name]'s website [specific issue: outdated / doesn't exist / not mobile-friendly].

I help local businesses get 3-5x more inquiries with professional websites. Most businesses I work with see results within 30 days.

Would you be open to a quick 10-minute call? I can show you how to get more customers online.

Check out my work: oliverseo.com

Best,
Oliver

---
Oliver
OliverSEO
[Your Physical Address]
[City, State ZIP]

Unsubscribe: [link] | View online: [link]
```

---

## ⚠️ COMMON MISTAKES TO AVOID

1. **Sending from Gmail/Yahoo** → Use professional domain
2. **No SPF/DKIM/DMARC** → Set these up immediately
3. **Sending too fast** → Warm up account first
4. **Spam trigger words** → Use natural language
5. **No personalization** → Personalize every email
6. **Too many links** → 1-2 links max
7. **No unsubscribe link** → Required by law
8. **High bounce rate** → Verify emails better
9. **No monitoring** → Check reputation weekly
10. **Buying email lists** → Don't do this (illegal + spam)

---

## 🎯 FOR YOUR 20-SITE STRATEGY

**Recommended Approach:**

1. **Week 1-2:** Set up email authentication + warm up account
2. **Week 3:** Start sending 10 emails/day (test deliverability)
3. **Week 4:** Increase to 20 emails/day
4. **Ongoing:** Monitor reputation, adjust as needed

**Tools You'll Need:**
- Professional email (Google Workspace: $6/month)
- Email verification tool (Hunter.io free tier, or NeverBounce)
- Deliverability testing (mail-tester.com - free)

**Total Cost:** ~$6-10/month

---

## 📊 EXPECTED RESULTS

**With Proper Setup:**
- **Inbox placement:** 85-95% (vs 20-30% without setup)
- **Reply rate:** 5-10% (vs 1-2% without setup)
- **Spam complaints:** < 0.1% (vs 2-5% without setup)

**Without Proper Setup:**
- Most emails go to spam
- Low reply rates
- Risk of account suspension
- Poor sender reputation

---

## 🔧 TECHNICAL SETUP (Step-by-Step)

### **Google Workspace Setup:**

1. **Sign up:** workspace.google.com
2. **Verify domain:** Follow Google's instructions
3. **Set up email:** Create oliver@oliverseo.com
4. **Add SPF:** Google provides the record
5. **Add DKIM:** Generate in Google Admin Console
6. **Add DMARC:** Create your own record
7. **Test:** Use mail-tester.com

**Time:** 1-2 hours

---

### **Microsoft 365 Setup:**

1. **Sign up:** microsoft365.com
2. **Verify domain:** Follow Microsoft's instructions
3. **Set up email:** Create oliver@oliverseo.com
4. **Add SPF:** Microsoft provides the record
5. **Add DKIM:** Enable in Microsoft 365 Admin Center
6. **Add DMARC:** Create your own record
7. **Test:** Use mail-tester.com

**Time:** 1-2 hours

---

## 🎯 BOTTOM LINE

**To Keep Emails Out of Spam:**

1. ✅ Use professional email domain (not Gmail)
2. ✅ Set up SPF, DKIM, DMARC (critical)
3. ✅ Warm up account (2-4 weeks)
4. ✅ Avoid spam trigger words
5. ✅ Personalize every email
6. ✅ Follow CAN-SPAM rules
7. ✅ Monitor reputation weekly

**Do this BEFORE sending your 20 emails. It takes 1-2 hours to set up, but saves you from 90% of spam issues.**

---

## 📚 RESOURCES

**Testing Tools:**
- mail-tester.com (deliverability test)
- mxtoolbox.com (SPF/DKIM/DMARC checker)
- senderscore.org (sender reputation)

**Email Services:**
- Google Workspace ($6/month)
- Microsoft 365 ($6/month)
- SendGrid (free tier: 100 emails/day)

**Warming Tools:**
- Lemwarm ($29/month)
- Warmbox ($19/month)
- Mailwarm ($15/month)

---

**Start with email authentication. That's 80% of the battle. Then warm up your account. Then start sending.**
