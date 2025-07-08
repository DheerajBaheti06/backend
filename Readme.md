

# YouTube Backend Clone - "YouTube's Big Brother"

A comprehensive backend implementation for a YouTube-like video platform built with Node.js, Express, and MongoDB. This project provides a complete RESTful API for user management, video operations, and social features.

## 🚀 Features

### User Management
- **User Registration & Authentication**: Complete signup/login system with JWT tokens
- **Profile Management**: Update profile details, avatar, and cover images
- **Password Management**: Secure password hashing with bcrypt and password change functionality
- **Session Management**: Access token and refresh token implementation
- **User Profiles**: Channel-like user profiles with subscription statistics

### Video Platform Features
- **Video Upload & Management**: Video file handling with Cloudinary integration
- **Video Metadata**: Title, description, thumbnail, duration, and view count
- **Watch History**: Track user video viewing history
- **Channel System**: User channels with subscriber/subscription functionality

### Social Features
- **Tweet System**: Create, read, update, and delete tweets
- **Comment System**: Video commenting functionality
- **Like System**: Like videos and tweets
- **Subscription System**: Subscribe to channels and track subscriptions
- **Playlists**: Create and manage video playlists

### Media Management
- **File Upload**: Multer middleware for handling file uploads
- **Cloud Storage**: Cloudinary integration for storing images and videos
- **Image Processing**: Avatar and cover image management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Environment**: dotenv
- **Development**: Nodemon
- **Additional**: CORS, Cookie Parser, Aggregate Pagination

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers and business logic
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   ├── tweet.controller.js
│   │   └── healthCheck.controller.js
│   ├── models/            # MongoDB schemas and models
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   ├── tweet.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── subscription.model.js
│   │   └── playlist.model.js
│   ├── routes/            # API route definitions
│   │   ├── user.routes.js
│   │   ├── tweet.routes.js
│   │   └── healthCheck.routes.js
│   ├── middlewares/       # Custom middleware functions
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── utils/            # Utility functions and classes
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   ├── db/               # Database connection
│   │   └── index.js
│   ├── app.js           # Express app configuration
│   ├── index.js         # Application entry point
│   └── constants.js     # Application constants
├── config/
│   └── config.env       # Environment variables
├── public/
│   └── temp/           # Temporary file storage
├── package.json
└── README.md
```

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/DheerajBaheti06/backend.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `config/config.env` file with the following variables:
   ```env
   PORT=8001
   MONGODB_URI=
   CORS_ORIGIN=*
   
   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   
   # Cloudinary Configuration
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8001`

## 📚 API Documentation

### Base URL
```
http://localhost:8001/api/v1
```

### User Routes (`/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | User registration | No |
| POST | `/login` | User login | No |
| POST | `/logout` | User logout | Yes |
| POST | `/refresh-token` | Refresh access token | No |
| POST | `/change-password` | Change password | Yes |
| GET | `/current-user` | Get current user | Yes |
| PATCH | `/update-account` | Update account details | Yes |
| PATCH | `/avatar` | Update avatar | Yes |
| PATCH | `/cover-image` | Update cover image | Yes |
| GET | `/c/:username` | Get user channel profile | Yes |
| GET | `/watch-history` | Get watch history | Yes |

### Tweet Routes (`/tweets`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create tweet | Yes |
| GET | `/user-tweets` | Get user tweets | Yes |
| POST | `/update-tweet` | Update tweet | Yes |
| DELETE | `/delete-tweet` | Delete tweet | Yes |

### Authentication

The API uses JWT tokens for authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

Or as a cookie named `accessToken`.

## 🗃️ Database Models

### User Model
- **Fields**: username, email, fullName, avatar, coverImage, watchHistory, password, refreshToken
- **Features**: Password hashing, JWT token generation, aggregation pipelines for channel stats

### Video Model
- **Fields**: videoFile, thumbnail, title, description, duration, views, isPublished, owner
- **Features**: Cloudinary URLs, pagination support, owner references

### Tweet Model
- **Fields**: content, owner
- **Features**: Basic CRUD operations, owner references

### Subscription Model
- **Fields**: subscriber, channel
- **Features**: Many-to-many relationship for user subscriptions

### Comment Model
- **Fields**: content, video, owner
- **Features**: Video commenting with pagination

### Like Model
- **Fields**: video, likedBy, tweet
- **Features**: Polymorphic likes for videos and tweets

### Playlist Model
- **Fields**: name, description, videos, owner
- **Features**: Video collection management

## 🔐 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request validation and sanitization
- **CORS Configuration**: Cross-origin resource sharing setup
- **File Upload Security**: Multer middleware with file type validation
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

The application is configured for easy deployment with:
- Environment-based configuration
- Modular architecture
- Error handling middleware
- Logging and monitoring setup

## 👨‍💻 Developer

**Dheeraj Baheti**
- GitHub: [@DheerajBaheti](https://github.com/DheerajBaheti06/backend)
- Repository: [backend](https://github.com/DheerajBaheti06/backend)

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/DheerajBaheti06/backend/issues).

## 📊 Development Status

- ✅ User authentication and authorization
- ✅ User profile management
- ✅ Tweet functionality
- ✅ File upload and cloud storage
- ✅ Database models and relationships
- 🚧 Video upload and management (in progress)
- 🚧 Comment system (in progress)
- 🚧 Like system (in progress)
- 🚧 Playlist management (in progress)
- 🚧 Subscription system (in progress)

---

*This project is part of a backend development learning journey, implementing a complete YouTube-like platform from scratch to advanced level.*
