# 📊 Data Collection & Delivery Setup Guide

**Goal:** Collect client information from AI calls and send to Mike via Google Sheets + Email

**Flow:** Vapi.ai → Webhook → Make.com → Google Sheets + Email

---

## 🎯 WHAT WE'RE SETTING UP

**Data to Collect:**
- Name
- Phone Number
- Email
- Reason for Calling (home/auto/life insurance OR "Need to talk to Mike")
- Details (what it's regarding)
- Date/Time of Call

**Where It Goes:**
1. **Google Sheets** - For tracking and organization
2. **Email to Mike** - Real-time notifications (as calls come in)
3. **Email to Kayleigh** - Also send to Kody@mwfbi.com (optional, or instead of Mike)

---

## 📋 STEP 1: Set Up Data Extraction in Vapi.ai

### **In Vapi.ai Dashboard:**

1. **Go to your Assistant/Agent settings**
2. **Find "Data Extraction" or "Variables" section**
3. **Set up these fields to extract:**

   **Field 1: Name**
   - Variable name: `name`
   - Description: "Caller's full name"
   - Required: Yes

   **Field 2: Phone**
   - Variable name: `phone`
   - Description: "Caller's phone number"
   - Required: Yes

   **Field 3: Email**
   - Variable name: `email`
   - Description: "Caller's email address"
   - Required: Yes

   **Field 4: Reason**
   - Variable name: `reason`
   - Description: "Reason for calling - either quote type (home/auto/life) or 'Need to talk to Mike'"
   - Required: Yes

   **Field 5: Details**
   - Variable name: `details`
   - Description: "Additional details about what they need"
   - Required: No (optional)

4. **Update your System Prompt** to explicitly extract these:
   ```
   Always extract and save:
   - Caller's full name
   - Phone number
   - Email address
   - Reason for calling (quote type or "Need to talk to Mike")
   - Any additional details mentioned
   ```

---

## 🔗 STEP 2: Set Up Webhook in Vapi.ai

### **In Vapi.ai Dashboard:**

1. **Go to "Integrations" or "Webhooks" section**
2. **Click "Add Webhook" or "Server URL"**
3. **You'll get a webhook URL from Make.com first** (see Step 3)
4. **Paste the Make.com webhook URL here**
5. **Configure what data to send:**

   **Webhook Payload Structure:**
   ```json
   {
     "name": "{{name}}",
     "phone": "{{phone}}",
     "email": "{{email}}",
     "reason": "{{reason}}",
     "details": "{{details}}",
     "timestamp": "{{timestamp}}",
     "call_duration": "{{call_duration}}"
   }
   ```

6. **Set trigger:** "After call ends" or "When data is collected"
7. **Test the webhook** (Vapi.ai should have a test button)

---

## 🔧 STEP 3: Set Up Make.com Workflow

### **Create New Scenario in Make.com:**

1. **Sign up/Login to Make.com** (make.com)
2. **Click "Create a new scenario"**
3. **Name it:** "Farm Bureau AI Receptionist - Data Collection"

### **Module 1: Webhook (Trigger)**

1. **Add "Webhooks" → "Custom webhook"**
2. **Click "Add" to create webhook**
3. **Important Settings:**
   - **Method:** `POST` (Vapi.ai Server Function sends POST requests)
   - **Data structure:** `Key-Value pairs` or `JSON` (depending on how Vapi.ai sends it)
4. **Copy the webhook URL** (looks like: `https://hook.make.com/xxxxxxxxxxxxx`)
5. **Go back to Vapi.ai and paste this URL** in the Server Function tool settings
6. **In Make.com, click "Save"**
7. **Test:** Make a call and check what data structure Make.com receives

**Note:** If using Vapi.ai Server Function tool, the data might be in:
- `{{1.body.name}}` (if in request body)
- `{{1.data.name}}` (if nested in data object)
- `{{1.name}}` (if at root level)
- Check the webhook output after a test call to see the actual structure

### **Module 2: Google Sheets - Add Row**

1. **Add "Google Sheets" → "Add a row"**
2. **Connect your Google account** (if not already connected)
3. **Select or create spreadsheet:**
   - Create new: "Farm Bureau AI Calls"
   - Or use existing spreadsheet
4. **Set up columns:**

   **Spreadsheet Structure:**
   ```
   Column A: Date/Time
   Column B: Name
   Column C: Phone
   Column D: Email
   Column E: Reason
   Column F: Details
   Column G: Status
   ```

5. **Map the data from webhook:**

   **Mapping (for Vapi.ai Structured Outputs):**
   - Date/Time: Use Make.com's `{{now}}` function
   - Name: `{{7.message.artifact.structuredOutputs.`bb81f27f-9ba3-401c-b3a5-d1ab636afcf3`.result.`name `}}`
   - Phone: `{{7.message.artifact.structuredOutputs.`bb81f27f-9ba3-401c-b3a5-d1ab636afcf3`.result.`phone number `}}`
   - Email: `{{7.message.artifact.structuredOutputs.`bb81f27f-9ba3-401c-b3a5-d1ab636afcf3`.result.Email}}`
   - Reason: `{{7.message.artifact.structuredOutputs.`bb81f27f-9ba3-401c-b3a5-d1ab636afcf3`.result.`Reason for Calling`}}`
   - Status: "New" (static text)

   **Note:** 
   - The UUID `bb81f27f-9ba3-401c-b3a5-d1ab636afcf3` is your Vapi.ai structured output ID - use the visual mapper to find your exact ID
   - The module number (7) may be different - use the actual module number from your Make.com scenario
   - Field names may have trailing spaces - keep them as-is when mapping

6. **Click "OK" to save**

### **Module 3: Email - Send Email (Using Mailgun)**

1. **Add "Mailgun" → "Send an email"**
2. **Create Mailgun connection:**
   - Click "Add" or "Create connection"
   - Enter your Mailgun Private API key
   - Enter your Mailgun domain (e.g., `sandbox123.mailgun.org`)
   - Save connection

3. **Configure email settings:**

   **Domain:** Your Mailgun domain (e.g., `sandbox123.mailgun.org`)

   **Type of recipient:** `To`

   **To:** `Kody@mwfbi.com` (or Mike's email)
   - **Note:** If using Mailgun sandbox, add recipient as authorized in Mailgun dashboard first

   **From:** `Farm Bureau AI Receptionist <noreply@YOUR_DOMAIN>`
   - Replace `YOUR_DOMAIN` with your Mailgun domain

   **Subject:** 
   ```
   New Call from AI Receptionist - {{7.message.artifact.structuredOutputs.`bb81f27f-9ba3-401c-b3a5-d1ab636afcf3`.result.`name `}}
   ```

   **Format:** `HTML` or `Plain text`

   **Body/Text (HTML Format):**
   ```
   <h3>📞 New Call</h3>
   <hr>
   <p><strong>Name:</strong> {{7.message.artifact.structuredOutputs.`bb81f27f-9ba3-401c-b3a5-d1ab636afcf3`.result.`name `}}</p>
   <p><strong>Email:</strong> {{7.message.artifact.structuredOutputs.`bb81f27f-9ba3-401c-b3a5-d1ab636afcf3`.result.Email}}</p>
   <p><strong>Phone:</strong> {{7.message.artifact.structuredOutputs.`bb81f27f-9ba3-401c-b3a5-d1ab636afcf3`.result.`phone number `}}</p>
   <p><strong>Reason for Calling:</strong> {{7.message.artifact.structuredOutputs.`bb81f27f-9ba3-401c-b3a5-d1ab636afcf3`.result.`Reason for Calling`}}</p>
   <p><strong>Date/Time:</strong> {{now}}</p>
   <hr>
   <p><em>Sent via Vapi Assistant</em></p>
   ```

   **Important:** 
   - The UUID `bb81f27f-9ba3-401c-b3a5-d1ab636afcf3` is your Vapi.ai structured output ID - this may be different for your setup
   - Use the visual mapper in Make.com to find the exact paths for your data
   - Field names may have trailing spaces (like `name ` or `phone number `) - keep them as-is
   - The module number (7) may be different - use the actual module number from your Make.com scenario

4. **Click "OK" to save**

**Alternative: Using Gmail/Email Module (if Mailgun doesn't work):**

1. **Add "Email" → "Send an email"**
2. **Configure the same way as above**
3. **Note:** Gmail may block automated emails - Mailgun is more reliable

### **Optional: Module 4 - Send to Kayleigh Too**

1. **Add another "Email" → "Send an email"**
2. **To:** Kody@mwfbi.com
3. **Same subject and body as above**
4. **Click "OK" to save**

### **Save and Activate:**

1. **Click "Save" in Make.com**
2. **Toggle "On" to activate the scenario**
3. **The webhook URL is now live!**

---

## ✅ STEP 4: Test the Entire Flow

### **Test Checklist:**

1. **Make a test call** to the Vapi.ai number
2. **Go through the conversation:**
   - Say your name
   - Give phone number
   - Give email
   - Say you need a quote for auto insurance
3. **End the call**
4. **Check:**
   - [ ] Make.com webhook received data (check Make.com logs)
   - [ ] Google Sheet has new row with your info
   - [ ] Email was sent to Mike/Kayleigh
   - [ ] All data is correct

### **If Something Doesn't Work:**

**Webhook not receiving data:**
- Check Vapi.ai webhook URL is correct
- Check Make.com scenario is "On"
- Check Vapi.ai webhook is configured to trigger "After call ends"

**Google Sheets not updating:**
- Check Google account is connected in Make.com
- Check column mapping is correct
- Check spreadsheet permissions

**Email not sending:**
- Check email addresses are correct
- Check Make.com email module is configured
- Check spam folder

---

## 📊 STEP 5: Create Google Sheet Template

### **Create Spreadsheet:**

1. **Go to Google Sheets**
2. **Create new spreadsheet:** "Farm Bureau AI Calls"
3. **Set up columns:**

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | Date/Time | Name | Phone | Email | Reason | Details | Status |
   | | | | | | | |

4. **Format header row:**
   - Make it bold
   - Add background color (light blue or gray)
   - Freeze header row (View → Freeze → 1 row)

5. **Share with Mike:**
   - Click "Share" button
   - Add Mike's email
   - Give "Editor" access

6. **Copy the spreadsheet ID:**
   - From URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
   - Use this in Make.com when selecting the spreadsheet

---

## 📧 STEP 6: Email Configuration

### **Get Email Addresses:**

**Ask Mike:**
- What email should receive the notifications?
- Should it go to both Mike and Kayleigh?
- Any specific email format preferences?

### **Email Template Options:**

**Option 1: Simple (Recommended)**
```
Subject: New Call from AI Receptionist - [Name]

New call received:

Name: [Name]
Phone: [Phone]
Email: [Email]
Reason: [Reason]
Details: [Details]
Date/Time: [Timestamp]

Please follow up.
```

**Option 2: Detailed**
```
Subject: New AI Receptionist Call - [Name] - [Reason]

A new call was received from the AI receptionist:

Caller Information:
- Name: [Name]
- Phone: [Phone]
- Email: [Email]

Call Details:
- Reason: [Reason]
- Additional Details: [Details]
- Date/Time: [Timestamp]

Next Steps:
- Review the information above
- Follow up with the caller
- Update status in Google Sheet when contacted

View full spreadsheet: [Link to Google Sheet]
```

---

## 🔄 STEP 7: Final Configuration

### **In Vapi.ai:**

1. **Verify data extraction is set up** (Step 1)
2. **Verify webhook URL is correct** (Step 2)
3. **Test with a call** (Step 4)

### **In Make.com:**

1. **Verify scenario is "On"**
2. **Check webhook is receiving data**
3. **Test Google Sheets connection**
4. **Test email sending**

### **In Google Sheets:**

1. **Verify spreadsheet is set up correctly**
2. **Test that Make.com can write to it**
3. **Share with Mike**

---

## 🚨 TROUBLESHOOTING

### **Problem: Webhook not working**

**Solution:**
1. Check Vapi.ai webhook URL matches Make.com webhook URL
2. Check Make.com scenario is activated ("On")
3. Check Vapi.ai webhook trigger is set correctly
4. Test webhook manually in Make.com

### **Problem: Data not appearing in Google Sheets**

**Solution:**
1. Check Google account is connected in Make.com
2. Check spreadsheet ID is correct
3. Check column mapping matches spreadsheet columns
4. Check spreadsheet permissions (Make.com needs access)

### **Problem: Email not sending**

**Solution:**
1. Check email addresses are correct
2. Check Make.com email module is configured
3. Check spam folder
4. Test email module separately

### **Problem: Missing data fields**

**Solution:**
1. Check Vapi.ai data extraction is set up correctly
2. Check system prompt tells AI to extract all fields
3. Check webhook payload includes all fields
4. Test with a call and verify AI collects all info

### **Problem: Data paths not working in Make.com / Webhook not receiving data**

**If using Vapi.ai Server Function Tool:**

The Server Function tool sends data via POST, but Make.com might not be receiving it correctly.

**Step 1: Check Webhook Configuration**
1. In Make.com, open Module 1 (Custom webhook)
2. Make sure it's set to accept `POST` requests
3. Check the webhook URL matches what's in Vapi.ai

**Step 2: Check What Data Make.com Receives**
1. Make a test call to Vapi.ai
2. In Make.com, go to "Execution history"
3. Find the most recent execution
4. Click on Module 1 (webhook)
5. Look at the "Output" section - expand ALL fields
6. Look for where the data actually is:
   - Check `body` object
   - Check `data` object
   - Check root level
   - Check if it's nested in a function call structure

**Step 3: Common Data Locations**
The data might be in:
- `{{1.body.name}}` (if in request body)
- `{{1.data.name}}` (if nested in data object)
- `{{1.name}}` (if at root level)
- `{{1.function.arguments.name}}` (if in function arguments)
- `{{1.toolCalls.0.function.arguments.name}}` (if using dot notation: `.0` instead of `[0]`)

**Step 4: Use Visual Mapper**
1. In Mailgun or Google Sheets module, click the mapping icon
2. Browse the data structure from Module 1
3. Expand all nested objects
4. Find where `name`, `phone`, `email`, `reason` actually are
5. Click on them to insert the correct path

**Step 5: If Still No Data**
If the webhook output shows no data fields at all:
1. Check Vapi.ai Server Function tool is enabled
2. Check the Server URL in Vapi.ai matches Make.com webhook URL exactly
3. Make a test call and verify the tool is being called (check Vapi.ai chat logs)
4. The data might need to be sent differently - check Vapi.ai documentation for Server Function tool format

**Note:** Make.com doesn't support `[0]` bracket notation in some contexts. Use `.0` (dot notation) instead, or use the visual mapper to find the correct path.

---

## ✅ FINAL CHECKLIST

Before going live:

- [ ] Vapi.ai data extraction configured (name, phone, email, reason, details)
- [ ] Vapi.ai webhook URL set to Make.com webhook
- [ ] Make.com scenario created and activated
- [ ] Google Sheets created with correct columns
- [ ] Google Sheets shared with Mike
- [ ] Make.com connected to Google Sheets
- [ ] Email addresses configured (Mike and/or Kayleigh)
- [ ] Test call completed successfully
- [ ] Data appears in Google Sheets
- [ ] Email received with correct information
- [ ] Mike has access to Google Sheet
- [ ] Everything tested and working

---

## 🎯 QUICK REFERENCE

**Vapi.ai Webhook URL:** (Get from Make.com)
```
https://hook.make.com/xxxxxxxxxxxxx
```

**Google Sheet:** (Share with Mike)
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

**Email Recipients:**
- Mike: [Get from Mike]
- Kayleigh: Kody@mwfbi.com

**Data Fields:**
- name
- phone
- email
- reason
- details
- timestamp

---

**Once this is set up, every call will automatically:**
1. ✅ Collect caller information
2. ✅ Save to Google Sheets
3. ✅ Email Mike/Kayleigh
4. ✅ Be ready for follow-up!

**Let's get this set up! 🚀**
