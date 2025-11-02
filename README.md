# 🎓 Academic Website Template

A modern, responsive, and professional academic website template built with HTML5, CSS3, and JavaScript. Perfect for researchers, professors, and graduate students to showcase their work, publications, and academic achievements.

![Website Preview](https://via.placeholder.com/800x400/2563eb/ffffff?text=Academic+Website+Preview)

## ✨ Features

- **📱 Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- **🎨 Modern Design** - Clean, professional academic aesthetic
- **⚡ Fast Loading** - Optimized performance with minimal dependencies
- **♿ Accessible** - WCAG compliant with semantic HTML
- **🔍 SEO Optimized** - Meta tags, structured data, and search-friendly
- **📊 GitHub Pages Ready** - Easy deployment with automated workflows
- **🎯 Academic Focus** - Sections for research, publications, teaching, CV
- **📞 Contact Forms** - Built-in contact form (requires backend setup)
- **🔗 Social Integration** - Links to academic profiles and social media
- **📱 PWA Support** - Can be installed as a web app (optional)

## 📄 Pages Included

1. **Homepage** - Hero section, about, recent publications
2. **Research** - Research areas, publications with filters, ongoing projects
3. **Teaching** - Course history, student mentoring, teaching philosophy
4. **CV** - Complete curriculum vitae with downloadable PDF
5. **Contact** - Contact information, form, office location, collaboration opportunities

## 🚀 Quick Start

### Option 1: Use as Template (Recommended)

1. **Click "Use this template"** on GitHub to create your own repository
2. **Clone your repository**:
   ```bash
   git clone https://github.com/yourusername/your-academic-website.git
   cd your-academic-website
   ```

### Option 2: Fork or Download

1. **Fork this repository** or download the ZIP file
2. **Clone locally**:
   ```bash
   git clone https://github.com/yourusername/academic-website-template.git
   cd academic-website-template
   ```

## 🛠️ Setup Instructions

### 1. Basic Information Setup

Replace all placeholder content marked with `[Your Name]`, `[Your Title]`, etc.:

**Files to update:**
- `index.html` - Homepage content
- `research.html` - Research areas and publications
- `teaching.html` - Teaching experience and courses
- `cv.html` - Curriculum vitae content
- `contact.html` - Contact information
- `_config.yml` - Site configuration

### 2. Add Your Content

#### Profile Image
- Add your professional headshot as `images/profile.jpg`
- Recommended size: 400x400px or larger, square aspect ratio
- Formats supported: JPG, PNG, WebP

#### CV Document
- Add your CV as `documents/CV_YourName.pdf`
- Update the download link in `cv.html`
- Keep file size under 5MB for web compatibility

#### Publications
- Update publication lists in `research.html`
- Add links to PDFs, code repositories, and datasets
- Use the filtering system to categorize publications

### 3. Customize Design (Optional)

#### Colors
Edit `css/style.css` to change the color scheme:
```css
/* Primary color - currently blue (#2563eb) */
.btn-primary, .nav-link.active, etc.

/* Accent color - currently green (#059669) */
.course-level, .award-organization, etc.
```

#### Fonts
The site uses Inter font by default. To change fonts, update the Google Fonts import in HTML files and CSS font-family declarations.

#### Layout
- Modify grid layouts in CSS for different column arrangements
- Adjust spacing and padding values
- Customize responsive breakpoints

## 🌐 GitHub Pages Deployment

### Automatic Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial setup of academic website"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository → Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main" / Root
   - Save

3. **Wait for deployment** (usually 5-10 minutes)
   - Check Actions tab for deployment progress
   - Your site will be available at `https://yourusername.github.io/repository-name`

### Custom Domain (Optional)

1. **Add CNAME file** with your domain:
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Configure DNS** with your domain provider:
   - Add CNAME record pointing to `yourusername.github.io`
   - Or A records pointing to GitHub Pages IPs

3. **Enable HTTPS** in repository settings

## 🔧 Advanced Configuration

### Contact Form Setup

The contact form requires a backend service. Options include:

#### Option 1: Netlify Forms (Recommended)
```html
<form netlify data-netlify="true" name="contact">
```

#### Option 2: Formspree
```html
<form action="https://formspree.io/f/your-form-id" method="POST">
```

#### Option 3: Custom Backend
- PHP script on your own server
- Node.js/Express server
- Python Flask/Django application

### Analytics Integration

Add Google Analytics by updating `_config.yml`:
```yaml
google_analytics: "G-XXXXXXXXXX"
```

### SEO Enhancement

1. **Update meta descriptions** in each HTML file
2. **Add Open Graph tags** for social media sharing
3. **Create XML sitemap** (automatically generated with Jekyll)
4. **Submit to search engines** (Google Search Console, Bing)

### Performance Optimization

1. **Optimize images**:
   ```bash
   # Using ImageOptim, TinyPNG, or similar tools
   ```

2. **Enable compression** on your hosting provider

3. **Use CDN** for faster global loading

## 📱 Mobile Optimization

The site is fully responsive with breakpoints at:
- **Desktop**: 1200px and above
- **Tablet**: 768px to 1199px
- **Mobile**: 767px and below

Test responsiveness:
1. Use browser developer tools
2. Test on actual devices
3. Check with online tools like BrowserStack

## ♿ Accessibility Features

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color ratios
- Screen reader compatible
- Alt text for images

## 🔒 Privacy and Security

### Personal Information
- Only include professional contact details
- Remove sensitive information from CV
- Consider using institutional email

### GDPR Compliance
- Add privacy policy if collecting data
- Include cookie notice if using analytics
- Provide data deletion options

## 🐛 Troubleshooting

### Common Issues

**Site not loading after GitHub Pages setup:**
- Check repository settings → Pages
- Ensure `index.html` is in the root directory
- Wait 10-15 minutes for DNS propagation

**Images not displaying:**
- Check file paths are correct
- Ensure images are in the `images/` folder
- Verify file extensions match HTML references

**Contact form not working:**
- Forms require backend setup (see Advanced Configuration)
- Test with a service like Formspree or Netlify

**Mobile menu not working:**
- Ensure JavaScript is enabled
- Check console for JavaScript errors
- Verify `js/script.js` is loading

### Performance Issues

**Site loading slowly:**
- Optimize image sizes
- Enable compression
- Use WebP format for images
- Minimize CSS and JavaScript

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Inter Font** by Rasmus Andersson
- **Font Awesome** for icons
- **GitHub Pages** for free hosting
- **Academic community** for feedback and suggestions

## 📞 Support

If you need help setting up your academic website:

1. **Check the documentation** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed description
4. **Join discussions** in the repository

## 🚀 What's Next?

After setting up your basic website, consider:

- **Regular updates** with new publications and achievements
- **Blog integration** using Jekyll or external service
- **Multi-language support** for international audience
- **Advanced analytics** with heatmaps and user behavior tracking
- **Newsletter signup** to keep visitors informed
- **Interactive elements** like publication search or filtering

---

## 📊 File Structure

```
academic-website/
├── 📁 .github/
│   └── 📁 workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── 📁 css/
│   └── style.css               # Main stylesheet
├── 📁 documents/
│   └── README.md               # Instructions for adding CV
├── 📁 images/
│   └── README.md               # Instructions for adding photos
├── 📁 js/
│   └── script.js               # Interactive functionality
├── .gitignore                  # Git ignore rules
├── .nojekyll                   # Disable Jekyll processing
├── _config.yml                 # Site configuration
├── contact.html                # Contact page
├── cv.html                     # Curriculum vitae page
├── index.html                  # Homepage
├── research.html               # Research and publications
├── teaching.html               # Teaching experience
└── README.md                   # This file
```

---

**Built with ❤️ for the academic community**

*Happy researching! 🔬📚*