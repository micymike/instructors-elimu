# Elimu Global Backend

## Prerequisites
- Node.js 18.17.0
- MongoDB
- Cloudinary Account (optional)

## Local Development

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file with:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/instructors-elimu
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running the Application
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Render Deployment

### Configuration
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set Build Command: `npm install && npm run build`
4. Set Start Command: `npm run start:prod`

### Required Environment Variables
- `NODE_ENV`: Set to `production`
- `PORT`: Automatically set by Render
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Generate a secure random string
- `SESSION_SECRET`: Generate another secure random string
- `CLOUDINARY_*`: Optional cloud storage credentials

## Troubleshooting
- Ensure all dependencies are installed
- Check MongoDB connection
- Verify environment variables
- Review Render logs for specific errors

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and create a Pull Request
