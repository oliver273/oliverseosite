#!/usr/bin/env python3
"""
Create ICO file from SVG logo for Windows shortcut
"""
try:
    from PIL import Image, ImageDraw
    import os
    
    # Create a 256x256 icon with OliverSEO branding
    size = 256
    img = Image.new('RGBA', (size, size), (15, 23, 59, 255))  # Dark blue background
    draw = ImageDraw.Draw(img)
    
    # Draw orange circle (O)
    center_x = size // 3
    center_y = size // 2
    radius = size // 6
    draw.ellipse([center_x - radius, center_y - radius, center_x + radius, center_y + radius],
                outline=(245, 158, 11, 255), width=size//20)  # Orange color
    
    # Draw stylized S
    s_start_x = size // 2
    s_start_y = size // 4
    s_width = size // 3
    s_height = size // 2
    
    # Top curve of S
    draw.arc([s_start_x, s_start_y, s_start_x + s_width, s_start_y + s_height//2],
             start=0, end=180, fill=(245, 158, 11, 255), width=size//20)
    
    # Bottom curve of S
    draw.arc([s_start_x, s_start_y + s_height//2, s_start_x + s_width, s_start_y + s_height],
             start=180, end=360, fill=(245, 158, 11, 255), width=size//20)
    
    # Connect the curves
    draw.line([s_start_x + s_width, s_start_y + s_height//4, s_start_x + s_width, s_start_y + s_height//2],
              fill=(245, 158, 11, 255), width=size//20)
    draw.line([s_start_x, s_start_y + s_height//2, s_start_x, s_start_y + 3*s_height//4],
              fill=(245, 158, 11, 255), width=size//20)
    
    # Save as ICO with multiple sizes
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    icon_images = []
    for ico_size in ico_sizes:
        resized = img.resize(ico_size, Image.Resampling.LANCZOS)
        icon_images.append(resized)
    
    icon_images[0].save('icon.ico', format='ICO', sizes=[(s[0], s[1]) for s in ico_sizes])
    print("Icon created: icon.ico")
    
except ImportError:
    print("PIL/Pillow not installed. Creating simple icon file...")
    # Create a simple ICO file header (minimal valid ICO)
    # This is a basic fallback
    ico_data = bytes([
        0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x20, 0x20, 0x00, 0x00, 0x01, 0x00,
        0x20, 0x00, 0x28, 0x10, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00,
        0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, 0x01, 0x00,
        0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00
    ])
    
    with open('icon.ico', 'wb') as f:
        f.write(ico_data)
    print("Basic icon file created (install Pillow for better icon)")

except Exception as e:
    print(f"Error creating icon: {e}")
    print("You can manually create an icon.ico file or use an online converter.")



