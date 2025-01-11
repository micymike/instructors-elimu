# Elimu Global Frontend

## Prerequisites
- Node.js 18.17.0
- npm 9.x or later

## Local Development

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file with:
```
VITE_BACKEND_URL=https://instructors-elimu.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Running the Application
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Render Deployment

### Configuration
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set Build Command: `npm install && npm run build`
4. Set Publish Directory: `dist`

### Required Environment Variables
- `VITE_BACKEND_URL`: Backend API URL
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth Client ID
- Other environment variables as needed

## Troubleshooting
- Ensure Node.js version matches
- Check environment variable names
- Verify backend URL is correct
- Review Render build logs

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and create a Pull Request
