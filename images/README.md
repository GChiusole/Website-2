# Image Assets Directory

This directory contains all image assets used throughout the academic website.

## Directory Structure

```
images/
├── profile.jpg              # Profile photo for homepage
├── research/                # Research visualizations and animations
│   ├── *.gif               # Animated research figures
│   ├── *.mp4               # Video demonstrations
│   └── *.webp              # Optimized still images
├── convert_to_mp4.py       # Script to convert videos to MP4
├── convert_to_webp.py      # Script to convert images to WebP
├── optimize_fkpp_smooth.py # Optimize specific animations
├── optimize_gifs.py        # Batch GIF optimization
├── optimize_high_quality.py # High-quality image optimization
└── README.md               # This file
```

## Image Types

### Profile Photo
**Location**: `images/profile.jpg`

The main profile photo displayed on the homepage hero section.

**Specifications**:
- Format: JPG, PNG, or WebP
- Dimensions: Square (1:1 ratio), minimum 300×300px, recommended 600×600px
- File size: < 2MB
- Content: Professional headshot with good lighting and plain background

**To update**:
1. Replace `profile.jpg` with your new image
2. Keep the same filename, or update `index.html` line ~35 if using a different name

### Research Visualizations
**Location**: `images/research/`

Contains animations, videos, and images demonstrating research work, particularly for:
- Pattern formation simulations
- Stochastic dynamics visualizations
- SPDE solutions and traveling waves

**Formats**: GIF, MP4, WebM, WebP, PNG

**Specifications**:
- Optimized for web display (typically < 2MB)
- High quality while maintaining reasonable file sizes
- Suitable for embedding in research page expandable sections

## Optimization Scripts

Python scripts included for processing and optimizing images:

### `optimize_gifs.py`
Optimizes GIF files to reduce file size while maintaining quality.

**Usage**:
```bash
python3 optimize_gifs.py
```

### `convert_to_webp.py`
Converts images to modern WebP format for better compression and quality.

**Usage**:
```bash
python3 convert_to_webp.py
```

### `convert_to_mp4.py`
Converts video files to web-optimized MP4 format.

**Usage**:
```bash
python3 convert_to_mp4.py
```

### `optimize_fkpp_smooth.py`
Specialized script for optimizing FKPP equation animations.

### `optimize_high_quality.py`
High-quality optimization for publication-ready figures.

## Adding New Images

### For Profile Photo
1. Prepare a square, professional headshot
2. Resize to at least 600×600 pixels
3. Save as `profile.jpg`
4. Place in `images/` directory
5. Refresh website to see changes

### For Research Visualizations
1. Create or export your visualization
2. Use optimization scripts to reduce file size:
   ```bash
   python3 optimize_gifs.py        # For GIFs
   python3 convert_to_webp.py      # For images
   python3 convert_to_mp4.py       # For videos
   ```
3. Place optimized files in `images/research/`
4. Reference in HTML files as needed:
   ```html
   <img src="images/research/your-image.webp" alt="Description">
   ```

## Best Practices

### Image Optimization
- Always optimize images before uploading
- Use WebP for photos and detailed images
- Use optimized GIF or MP4 for animations
- Target < 1-2MB per file for web performance

### File Naming
- Use lowercase letters
- Separate words with hyphens: `travelling-wave.gif`
- Be descriptive: `fkpp-pattern-formation.mp4`
- Avoid spaces and special characters

### Accessibility
- Always provide meaningful `alt` text in HTML
- Ensure sufficient contrast for text overlays
- Test visibility on different screen sizes

## Tools

### Free Image Editors
- **GIMP** (Desktop) - Full-featured image editor
- **Photopea** (Online) - Photoshop-like interface
- **Canva** (Online) - Easy design tool
- **PIXLR** (Online) - Quick editing

### Command-Line Tools
- **ImageMagick** - Versatile image manipulation
- **FFmpeg** - Video and animation processing
- **optipng/pngquant** - PNG optimization
- **gifsicle** - GIF optimization

## Performance Tips

1. **Lazy Loading**: Large images below the fold are lazy-loaded automatically
2. **Responsive Images**: Consider providing multiple sizes for different devices
3. **Format Selection**:
   - Photos → WebP or optimized JPG
   - Diagrams/plots → PNG or WebP
   - Animations → Optimized GIF or MP4
   - Video → MP4 with H.264 codec

## Dependencies for Scripts

Python scripts may require:
```bash
pip install Pillow          # Image processing
pip install opencv-python   # Video processing
pip install imageio         # Animation handling
```

Check individual scripts for specific requirements.

## Questions?

For issues with images or scripts, check:
1. File permissions (scripts should be executable)
2. Python version (3.7+ recommended)
3. Required libraries installed
4. File paths and extensions are correct