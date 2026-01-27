# Portfolio Images

Place portfolio hero images in this directory.

## Portfolio Images

All portfolio images are currently SVG vector graphics for scalability and performance.

### Current Images

- `nonprofit-modernization-hero.svg` - For "Non-Profit Organization IT Modernization" case study
- `education-network-hero.svg` - For "Education Network Infrastructure Setup" case study  
- `cloud-migration-hero.svg` - For "Small Business Cloud Migration" case study

## Image Requirements

- **Format**: SVG (vector) preferred, or JPEG/PNG/WebP for photos
- **SVG Benefits**: Scalable, lightweight, perfect for illustrations
- **Photo Requirements** (if replacing SVGs):
  - Recommended size: 1200x800px or similar aspect ratio
  - File size: Optimized for web (under 500KB recommended)
- **Alt text**: Should be provided in portfolio item frontmatter as `heroImageAlt`

## Adding New Images

1. Add image file to this directory
2. Reference in portfolio item frontmatter: `heroImage: "/images/portfolio/filename.jpg"`
3. Add alt text: `heroImageAlt: "Descriptive alt text"`

Images will be automatically optimized during build if using Eleventy Image plugin.
