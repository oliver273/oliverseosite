# ⚡ Data Collection - Quick Reference

**Quick setup checklist for Vapi.ai → Make.com → Google Sheets + Email**

---

## 🎯 THE FLOW

```
Vapi.ai (collects info) 
  → Webhook 
    → Make.com (processes) 
      → Google Sheets (saves) 
      → Email (notifies Mike)
```

---

## 📋 QUICK SETUP STEPS

### **1. Vapi.ai - Data Extraction**
- Set up variables: `name`, `phone`, `email`, `reason`, `details`
- Update system prompt to extract these fields

### **2. Make.com - Create Webhook**
- Create new scenario
- Add "Custom webhook" module
- Copy webhook URL
- Paste into Vapi.ai webhook settings

### **3. Make.com - Google Sheets**
- Add "Google Sheets - Add a row" module
- Connect Google account
- Select/create spreadsheet: "Farm Bureau AI Calls"
- Map fields: name, phone, email, reason, details, timestamp

### **4. Make.com - Email**
- Add "Email - Send an email" module
- To: Mike's email (or Kody@mwfbi.com)
- Subject: "New Call from AI Receptionist - {{1.name}}"
- Body: Include all fields

### **5. Activate**
- Save Make.com scenario
- Turn "On"
- Test with a call

---

## 📊 GOOGLE SHEET COLUMNS

| Date/Time | Name | Phone | Email | Reason | Details | Status |
|-----------|------|-------|-------|--------|---------|--------|

---

## 🔗 WEBHOOK DATA STRUCTURE

```json
{
  "name": "{{name}}",
  "phone": "{{phone}}",
  "email": "{{email}}",
  "reason": "{{reason}}",
  "details": "{{details}}",
  "timestamp": "{{timestamp}}"
}
```

---

## 📧 EMAIL TEMPLATE

```
Subject: New Call from AI Receptionist - {{1.name}}

New call received:

Name: {{1.name}}
Phone: {{1.phone}}
Email: {{1.email}}
Reason: {{1.reason}}
Details: {{1.details}}
Date/Time: {{1.timestamp}}

Please follow up.
```

---

## ✅ TEST CHECKLIST

- [ ] Make test call
- [ ] Check Make.com received webhook
- [ ] Check Google Sheet has new row
- [ ] Check email was sent
- [ ] Verify all data is correct

---

## 🚨 COMMON ISSUES

**Webhook not working?**
- Check URL matches in both places
- Check Make.com scenario is "On"

**Google Sheets not updating?**
- Check Google account connected
- Check column mapping

**Email not sending?**
- Check email addresses
- Check spam folder

---

**See `DATA_COLLECTION_SETUP.md` for detailed instructions!**
