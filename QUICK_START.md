# Website Agent - Quick Start Guide

## 🚀 What You Have

A professional website generator agent that creates high-quality HTML websites worth $10,000 from simple text prompts!

## 📋 Files Created

- **`website_agent.py`** - Main agent script (the brain)
- **`demo_agent.py`** - Interactive demo with examples
- **`test_agent.py`** - Quick test script
- **`README_AGENT.md`** - Full documentation

## ⚡ Quick Start

### Option 1: Run the Demo (Recommended)
```bash
python demo_agent.py
```
Choose from pre-made examples or enter your own prompt.

### Option 2: Use the Main Agent
```bash
python website_agent.py
```
Enter your prompt when asked.

### Option 3: Use in Python Code
```python
from website_agent import WebsiteAgent

agent = WebsiteAgent()
prompt = "Create a modern restaurant website with red colors, 6 pages"
output_path = agent.generate_website(prompt)
```

## 💡 Example Prompts

### Restaurant Website
```
Create a modern restaurant website with red colors, 6 pages including 
home, menu, about, gallery, reservations, and contact
```

### Tech Startup
```
Build a tech startup website with blue colors, 5 pages for AcmeTech 
including home, about, services, products, and contact
```

### E-commerce Store
```
Make an ecommerce website with purple colors, 7 pages with shop, 
products, cart, checkout, about, and contact pages
```

### Portfolio Site
```
Create a creative portfolio website with teal colors, 4 pages for 
John Doe Photography
```

## 🎨 Supported Colors

The agent recognizes these color names:
- **blue** - Professional, tech-focused
- **green** - Natural, growth-oriented  
- **purple** - Creative, innovative
- **red** - Bold, energetic
- **orange** - Warm, friendly (default)
- **teal** - Modern, fresh
- **pink** - Playful, creative
- **dark** - Professional, sleek

Or use hex codes: `#3b82f6`, `#ef4444`, etc.

## 📁 Output Location

All websites are saved to: `generated_websites/[website_name]/`

Each website includes:
- `index.html` - Homepage
- Additional pages (about.html, services.html, etc.)
- `README.md` - Documentation

## ✨ Features

✅ **Intelligent Parsing** - Extracts colors, page count, business type from prompts
✅ **Professional Design** - Modern, responsive layouts
✅ **Custom Color Schemes** - Automatic color palette generation
✅ **Multi-Page Support** - Generates complete websites with navigation
✅ **Mobile Responsive** - Works on all devices
✅ **SEO Optimized** - Ready for search engines
✅ **No Dependencies** - Pure Python, standard library only

## 🎯 Tips for Best Results

1. **Be Specific**: Mention colors, page count, and business type
   - ✅ "Create a blue restaurant website with 5 pages"
   - ❌ "Make a website"

2. **List Pages**: Specify which pages you need
   - ✅ "5 pages: home, about, services, portfolio, contact"
   - ❌ "5 pages"

3. **Include Business Name**: Helps customize content
   - ✅ "Restaurant website for Joe's Pizza"
   - ❌ "A website"

## 📖 Full Documentation

See `README_AGENT.md` for complete documentation.

## 🧪 Test It Out

Run the test script to verify everything works:
```bash
python test_agent.py
```

This will generate a test website in `generated_websites/test_website/`

## 🎉 You're Ready!

Open any generated HTML file in your browser to see your professional website!

---

**Generate professional websites worth $10,000 in seconds!** 🚀

