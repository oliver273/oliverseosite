# Web3Forms Setup Instructions

## Getting Your Access Key

1. Go to **https://web3forms.com/**
2. Enter your email address: **oliver@oliverseo.com**
3. Click "Get Your Access Key"
4. Check your email for the access key
5. Copy the access key

## Adding the Access Key to Your Site

1. Open `index.html`
2. Find this line (around line 441):
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
   ```
3. Replace `YOUR_ACCESS_KEY_HERE` with your actual access key from Web3Forms
4. Save the file
5. Commit and push to GitHub

## How It Works

- When someone submits the form, Web3Forms will:
  - Send you an email with the form submission
  - Include all form fields (name, email, package, message)
  - Provide spam protection
  - Give you a dashboard to view submissions

## Testing

1. Fill out the form on your website
2. Submit it
3. Check your email (oliver@oliverseo.com) for the submission
4. You should receive an email with all the form details

## Benefits Over Mailto

- ✅ Works without opening email client
- ✅ Better spam protection
- ✅ Professional submission handling
- ✅ Email delivered directly to your inbox
- ✅ No dependency on user's email setup
- ✅ Works on all devices and browsers

---

**Note:** Make sure to replace `YOUR_ACCESS_KEY_HERE` with your actual access key before deploying!


