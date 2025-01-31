# Elimu Global Backend

## API Documentation
- Swagger Docs: `https://instructors-elimu.onrender.com/api/docs`

## Features
- User Authentication & Authorization
- Course Management
- Assignment Handling
- AI-Powered Grading Assistance
- File Upload & Management
- Student Progress Tracking

## Prerequisites
- Node.js 18.17.0
- MongoDB
- Cloudinary Account (optional)
- Google AI API Key (for Gemini integration)

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
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### Running the Application
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout

### Courses
- GET `/api/courses` - List all courses
- POST `/api/courses` - Create new course
- GET `/api/courses/:id` - Get course details
- PUT `/api/courses/:id` - Update course
- DELETE `/api/courses/:id` - Delete course

### Assignments
- GET `/api/assignments` - List assignments
- POST `/api/assignments` - Create assignment
- GET `/api/assignments/:id` - Get assignment details
- PUT `/api/assignments/:id` - Update assignment
- POST `/api/assignments/:id/submit` - Submit assignment
- POST `/api/assignments/:id/grade` - Grade assignment

### AI Services
- POST `/api/ai/grade` - AI-assisted grading
- POST `/api/ai/feedback` - Generate feedback
- POST `/api/ai/analyze` - Analyze student work

## Render Deployment

### Configuration
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set Build Command: `npm install && npm run build`
4. Set Start Command: `npm run start:prod`

### Required Environment Variables
- `NODE_ENV`: Set to `production`
- `PORT`: Automatically set by Render
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `SESSION_SECRET`: Secret for session management
- `CLOUDINARY_*`: Cloudinary credentials
- `GOOGLE_AI_API_KEY`: Google AI API key for Gemini integration

## Troubleshooting
- Ensure all dependencies are installed
- Check MongoDB connection
- Verify environment variables
- Review Render logs for specific errors
- Check Swagger docs at `/api/docs`

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
