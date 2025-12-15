# Website Generator Agent

A professional AI agent that generates high-quality HTML websites worth $10,000 from simple text prompts.

## Features

✨ **Intelligent Prompt Parsing**
- Automatically extracts color schemes from prompts
- Detects page count requirements
- Identifies business type and industry
- Extracts requested features

🎨 **Professional Design**
- Modern, responsive layouts
- Custom color schemes
- Mobile-first design
- Smooth animations
- SEO optimized

📄 **Multi-Page Support**
- Generates complete multi-page websites
- Automatic navigation between pages
- Consistent design across all pages
- Professional page templates

## Quick Start

### Basic Usage

```python
from website_agent import WebsiteAgent

agent = WebsiteAgent()

# Generate a website from a prompt
prompt = "Create a modern business website with blue colors, 5 pages"
output_path = agent.generate_website(prompt)
```

### Command Line

```bash
# Run the main agent
python website_agent.py

# Run demo examples
python demo_agent.py
```

## Example Prompts

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

## How It Works

1. **Prompt Analysis**: The agent analyzes your prompt to extract:
   - Color patterns (blue, red, purple, etc. or hex codes)
   - Page count (explicit numbers or inferred from page types)
   - Business type (restaurant, ecommerce, portfolio, etc.)
   - Features (contact forms, blog, portfolio, etc.)
   - Website title/name

2. **Website Generation**: Creates a complete website with:
   - Professional HTML structure
   - Custom CSS with your color scheme
   - Responsive design
   - Navigation between pages
   - Modern UI components

3. **Output**: Saves all files to `generated_websites/[website_name]/`

## Color Schemes

The agent supports these color presets:
- **Blue**: Professional, tech-focused
- **Green**: Natural, growth-oriented
- **Purple**: Creative, innovative
- **Red**: Bold, energetic
- **Orange**: Warm, friendly (default)
- **Teal**: Modern, fresh
- **Pink**: Playful, creative
- **Dark**: Professional, sleek

You can also specify hex codes like `#3b82f6` in your prompt.

## Page Types

The agent can generate these page types:
- Home/Index
- About
- Services
- Contact
- Portfolio
- Blog
- Products
- Pricing
- Team

## Generated Files

Each website includes:
- `index.html` - Homepage
- Additional pages based on your requirements
- `README.md` - Documentation with details

## Customization

After generation, you can:
- Edit HTML files to customize content
- Modify CSS variables to change colors
- Add your own images and assets
- Update contact forms with your email service
- Deploy to any web hosting service

## Requirements

- Python 3.7+
- No external dependencies (uses only standard library)

## Example Output Structure

```
generated_websites/
└── restaurant_website/
    ├── index.html
    ├── about.html
    ├── services.html
    ├── contact.html
    ├── portfolio.html
    └── README.md
```

## Tips for Best Results

1. **Be Specific**: Mention colors, page count, and business type
   - ✅ "Create a blue restaurant website with 5 pages"
   - ❌ "Make a website"

2. **Include Page Types**: List the pages you need
   - ✅ "5 pages: home, about, services, portfolio, contact"
   - ❌ "5 pages"

3. **Mention Your Business**: Helps customize content
   - ✅ "Restaurant website for Joe's Pizza"
   - ❌ "A website"

## Advanced Usage

### Custom Output Directory

```python
agent = WebsiteAgent()
agent.output_dir = Path("my_websites")
agent.generate_website(prompt, "custom_name")
```

### Access Requirements

```python
requirements = agent.parse_prompt(prompt)
print(f"Colors: {requirements['colors']}")
print(f"Pages: {requirements['page_count']}")
print(f"Business Type: {requirements['business_type']}")
```

## License

Free to use for any purpose.

## Support

For issues or questions, check the generated README.md in each website folder.

---

**Generate professional websites worth $10,000 in seconds!** 🚀

