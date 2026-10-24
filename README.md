# CourseMaster - Backend API

A RESTful API for the CourseMaster E-learning platform built with Node.js, Express, and MongoDB.

Video Link: https://drive.google.com/file/d/1vjMrBxr0-7xqjxMX2EBEBw30D_av1pOu/view

Admin email: admin@coursemaster.com
Pass: admin123

## Project Name & Description

**CourseMaster Backend** provides a comprehensive RESTful API for managing an E-learning platform. It handles authentication, course management, enrollments, assignments, quizzes, and administrative operations. The backend is built with Node.js and Express.js, using MongoDB for data storage and JWT for authentication.

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Input validation

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd courseMaster_Backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory (see `.env.example`)

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables (see `.env.example` for reference):

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/coursemaster

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Admin Registration Key (Optional - for admin account creation)
ADMIN_REGISTRATION_KEY=your-secret-admin-key-here

# Node Environment
NODE_ENV=development

# Email Configuration (Optional - for welcome emails)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

**Required Variables:**
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string (required)
- `JWT_SECRET` - Secret key for JWT token generation (required)

**Optional Variables:**
- `NODE_ENV` - Environment mode (development/production)
- `ADMIN_REGISTRATION_KEY` - Secret key for admin account registration (optional)
  - If set, users can register as admin by providing this key during registration
  - If not set, admin registration via key is disabled
  - Admins can still be created manually in the database
- `EMAIL_SERVICE` - Email service provider (gmail, smtp, etc.)
- `EMAIL_USER` - Email address for sending welcome emails
- `EMAIL_PASSWORD` - Email password or app password
- `FRONTEND_URL` - Frontend URL for email links

**Note for Email Setup:**
- For Gmail, you need to:
  1. Enable 2-Factor Authentication
  2. Generate an App Password (not your regular password)
  3. Use the App Password in `EMAIL_PASSWORD`
- If email is not configured, the app will still work but won't send welcome emails

## API Documentation

Local API base URL: `http://localhost:5000/api`

The health check is available at `http://localhost:5000/`.

For Postman, use the API base URL above. For protected endpoints, select the built-in token authentication mode and enter the token returned by login. Student endpoints require a student account; admin endpoints require an admin account.

### Authentication Endpoints

#### Register
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "adminKey": "optional-admin-key" 
  }
  ```
- **Response:** User object with token
- **Note:** 
  - With `ADMIN_REGISTRATION_KEY` configured, registrations without an admin key create student accounts
  - To register as "admin", provide a valid `adminKey` that matches `ADMIN_REGISTRATION_KEY`
  - If an invalid admin key is provided, registration will fail
  - `ADMIN_REGISTRATION_KEY` must be set before exposing registration. If it is unset, the current implementation can grant admin role to registrations without a key.

#### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** User object with token

#### Get Current User
- **GET** `/auth/me`
- **Response:** User object

### Course Endpoints (Public)

#### Get All Courses
- **GET** `/courses`
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 8)
  - `search` - Search by title or instructor
  - `sort` - Sort by price: `price_asc` or `price_desc`
  - `category` - Filter by category
  - `tags` - Filter by tags (comma-separated)
- **Response:** Paginated courses list

#### Get Course by ID
- **GET** `/courses/:id`
- **Response:** Course object with full details

### Enrollment Endpoints (Protected - Student)

#### Enroll in Course
- **POST** `/enrollments/:courseId`
- **Body (optional):**
  ```json
  {
    "batchId": "batch-id-here"
  }
  ```
- **Response:** Enrollment object

#### Get My Enrollments
- **GET** `/enrollments/my`
- **Response:** Array of enrollment objects

#### Mark Lesson as Complete
- **PATCH** `/enrollments/:enrollId/complete-lesson`
- **Body:**
  ```json
  {
    "lessonId": "lesson-id-here"
  }
  ```
- **Response:** Updated enrollment object

### Assignment Endpoints (Protected - Student)

#### Submit Assignment
- **POST** `/assignments/submit`
- **Body:**
  ```json
  {
    "courseId": "course-id",
    "lessonId": "lesson-id",
    "answer": "Answer text or Google Drive link",
    "answerType": "text" // or "link"
  }
  ```
- **Response:** Assignment submission object

#### Get My Submissions
- **GET** `/assignments/my`
- **Response:** Array of assignment submissions

#### Get Assignment Statistics
- **GET** `/assignments/stats?courseId=<course-id>`
- **Response:** Assignment average, reviewed count, and submissions for the course

### Quiz Endpoints (Protected - Student)

#### Submit Quiz
- **POST** `/quizzes/submit`
- **Body:**
  ```json
  {
    "courseId": "course-id",
    "lessonId": "lesson-id",
    "answers": [0, 1, 2, 0] // Array of selected option indices
  }
  ```
- **Response:** JSON object containing the submission ID, total questions, score, percentage, and creation time

#### Get My Quiz Submissions
- **GET** `/quizzes/my`
- **Optional query parameter:** `courseId`
- **Response:** Array of quiz submissions

#### Get Quiz Statistics
- **GET** `/quizzes/stats?courseId=<course-id>`
- **Response:** Average percentage and latest submission per lesson

### Admin Endpoints (Protected - Admin Only)

#### Create Course
- **POST** `/admin/courses`
- **Body:** See Course Schema below
- **Response:** Created course object

#### Update Course
- **PATCH** `/admin/courses/:id`
- **Body:** Course fields to update
- **Response:** Updated course object

#### Delete Course
- **DELETE** `/admin/courses/:id`
- **Response:** Success message

#### Get All Enrollments
- **GET** `/admin/enrollments`
- **Query Parameters:**
  - `courseId` - Filter by course
  - `batchId` - Filter by batch
- **Response:** Array of enrollment objects

#### Get All Assignments
- **GET** `/admin/assignments`
- **Response:** Array of assignment submissions

#### Get Analytics
- **GET** `/admin/analytics`
- **Response:** Analytics data including:
  - Chart data for enrollments over last 30 days
  - Top courses by enrollments
  - Platform statistics (total enrollments, courses, students, instructors)

#### Review Assignment
- **PATCH** `/admin/assignments/:id/review`
- **Body:**
  ```json
  {
    "status": "reviewed",
    "reviewNotes": "Great work!",
    "grade": 95
  }
  ```
- **Response:** Updated assignment submission

### User Management Endpoints (Protected - Admin Only)

All endpoints below require an admin bearer token.

#### List Users
- **GET** `/users`
- **Response:** Array of users without password hashes

#### Update User Role
- **PATCH** `/users/:id/role`
- **Body:**
  ```json
  {
    "role": "student"
  }
  ```
- **Allowed roles:** `student`, `admin`

#### Toggle User Ban
- **PATCH** `/users/:id/ban`
- **Response:** Updated user

#### Delete User
- **DELETE** `/users/:id`
- **Response:** Success message

## Data Models

### Course Schema
```javascript
{
  title: String (required, indexed),
  description: String (required),
  instructorName: String (required, indexed),
  price: Number (required),
  category: String (indexed),
  tags: [String] (indexed),
  syllabus: [{
    title: String (required),
    lessons: [{
      title: String (required),
      videoUrl: String (required),
      assignmentPrompt: String,
      quiz: [{
        question: String,
        options: [String],
        correctIndex: Number
      }]
    }]
  }],
  batches: [{
    name: String,
    startDate: Date
  }]
}
```

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  passwordHash: String (required),
  role: String (enum: ["student", "admin"], default: "student")
}
```

### Enrollment Schema
```javascript
{
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  batchId: ObjectId,
  progress: {
    completedLessons: [ObjectId],
    percent: Number (default: 0)
  }
}
```

## Error Handling

All errors follow this format:
```json
{
  "message": "Error message here"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Bonus Features

### Email Notifications
- Welcome emails are automatically sent to new users upon registration
- Uses Nodemailer for email delivery
- Configure email settings in `.env` file
- Email sending is non-blocking (won't fail registration if email fails)

### Analytics Dashboard
- Admin analytics dashboard with enrollment trends
- Charts showing enrollments over the last 30 days
- Top courses by enrollment statistics
- Platform-wide statistics (total enrollments, courses, students, instructors)
- Accessible at `/admin/analytics` (admin only)

## Admin Registration

Admins can be created in two ways:

1. **Registration Key Method (Recommended)**:
   - Set `ADMIN_REGISTRATION_KEY` in your `.env` file
   - During registration, provide the admin key in the registration form
   - If the key matches, the user will be created as "admin"
   - If the key is invalid or missing, registration will fail or create a student account

2. **Manual Database Method**:
   - Create admin users directly in the database
   - Set the `role` field to "admin" in the User document

**Note**: If `ADMIN_REGISTRATION_KEY` is not set in `.env`, admin registration via key is disabled for security.

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Admin-only routes with role checking
- Admin registration key protection
- Input validation with Zod
- CORS enabled

## Database Indexing

The following fields are indexed for performance:
- Course: `title`, `instructorName`, `category`, `tags`
- Enrollment: `{student: 1, course: 1}` (unique compound index)

## Deployment

The backend is deployed on **Vercel**. Make sure to set all environment variables in your deployment platform.

## Development

- Development server runs on `http://localhost:5000` (default)
- Uses `nodemon` for auto-restart during development
- MongoDB connection is handled via Mongoose
