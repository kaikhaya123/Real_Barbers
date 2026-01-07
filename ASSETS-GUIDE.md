# Assets Guide for Intro Section

## Required Video Assets

### Primary Video (for main visual area):
- **Filename**: `barber-fade-loop.mp4` 
- **Location**: `/public/Video/`
- **Specifications**:
  - Duration: 5-7 seconds
  - Looping: Yes
  - Audio: None (muted)
  - Resolution: 1080p minimum
  - Format: MP4 (H.264)
  - Aspect Ratio: 4:5 (portrait for mobile-friendly display)

### Content Ideas:
- Barber lining up a fade
- Beard detailing close-up  
- Client smile after a cut
- Mirror reflection shot

### Style Requirements:
- Warm lighting
- Shallow depth of field
- Pro Barber Shop ZA environment (not studio)
- Focus on hands, precision, tools

## Required Image Assets

### Poster Image (video fallback):
- **Filename**: `barber-working.jpg`
- **Location**: `/public/Images/`
- **Specifications**:
  - High quality (at least 1080p)
  - Same aspect ratio as video (4:5)
  - Should represent the video content

### Secondary Floating Image:
- **Filename**: `barber-detail.jpg` or similar
- **Location**: `/public/Images/`
- **Specifications**:
  - Square format (1:1 ratio)
  - Close-up shot (beard work, scissors, etc.)
  - High contrast, professional quality

## Asset Optimization Tips:
- Video should be under 2MB for web performance
- Images should be optimized for web (under 500KB)
- Use modern formats (WebP for images, WebM for video as alternative)
- Consider lazy loading for better performance

## Fallback Content:
If video assets are not available immediately, the component will show:
- Gradient background with icon placeholder
- Maintains layout and animations
- Easy to replace when actual assets are ready