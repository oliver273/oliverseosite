#!/usr/bin/env python3
"""
Convert logo image to ICO file for Windows shortcut
Supports PNG, JPG, JPEG, SVG formats
"""
import os
import sys

try:
    from PIL import Image
    
    # Look for logo files
    logo_files = ['logo.png', 'logo.jpg', 'logo.jpeg', 'logo.svg', 'dashboard_logo.png', 'dashboard_logo.jpg']
    logo_path = None
    
    for logo_file in logo_files:
        if os.path.exists(logo_file):
            logo_path = logo_file
            break
    
    if not logo_path:
        print("No logo file found. Please save your logo as one of these names:")
        print("  - logo.png")
        print("  - logo.jpg")
        print("  - logo.jpeg")
        print("  - dashboard_logo.png")
        print("  - dashboard_logo.jpg")
        print("\nPlace it in this folder and run this script again.")
        sys.exit(1)
    
    print(f"Found logo: {logo_path}")
    
    # Open and convert to ICO
    if logo_path.endswith('.svg'):
        # For SVG, we need to render it first
        try:
            from cairosvg import svg2png
            svg2png(url=logo_path, write_to='logo_temp.png', output_width=256, output_height=256)
            img = Image.open('logo_temp.png')
            os.remove('logo_temp.png')
        except ImportError:
            print("SVG support requires cairosvg. Converting SVG manually...")
            # Fallback: create from SVG description
            img = Image.new('RGBA', (256, 256), (15, 23, 59, 255))
    else:
        img = Image.open(logo_path)
    
    # Convert to RGBA if needed
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Resize to square if needed
    if img.width != img.height:
        size = max(img.width, img.height)
        new_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        offset = ((size - img.width) // 2, (size - img.height) // 2)
        new_img.paste(img, offset)
        img = new_img
    
    # Resize to 256x256 for high quality
    img = img.resize((256, 256), Image.Resampling.LANCZOS)
    
    # Create ICO with multiple sizes
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    icon_images = []
    for ico_size in ico_sizes:
        resized = img.resize(ico_size, Image.Resampling.LANCZOS)
        icon_images.append(resized)
    
    # Save as ICO
    icon_images[0].save('icon.ico', format='ICO', sizes=[(s[0], s[1]) for s in ico_sizes])
    print(f"✅ Icon created: icon.ico")
    print(f"   Source: {logo_path}")
    print(f"   Sizes: {', '.join([f'{s[0]}x{s[1]}' for s in ico_sizes])}")
    
except ImportError:
    print("ERROR: PIL/Pillow not installed.")
    print("Please install it: pip install Pillow")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)



