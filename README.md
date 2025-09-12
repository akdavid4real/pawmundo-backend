# 🐾 PawMundo Backend

> A comprehensive pet management platform built with NestJS, MongoDB, and modern web technologies.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-green.svg)](https://mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

PawMundo is a modern pet management platform that helps pet owners track their pets' health, schedule appointments, manage medical records, and connect with veterinarians. Built with a modular monolith architecture using NestJS, it provides a scalable and maintainable solution for comprehensive pet care management.

### Key Capabilities

- **User Management**: Secure authentication with JWT, role-based access control
- **Pet Profiles**: Complete pet information management with health tracking
- **Appointment Scheduling**: Veterinary appointment booking and management
- **Health Records**: Medical history tracking with reminders and analytics
- **File Management**: Cloudinary integration for image and document uploads
- **Background Jobs**: Redis-powered queue system for async processing
- **Real-time Features**: WebSocket support for notifications (planned)

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Password encryption with bcrypt
- Email verification system
- Password reset functionality
- Role-based access control (User, Vet, Admin)
- Request rate limiting
- Input validation and sanitization

### 🐕 Pet Management
- Complete pet profile creation and management
- Multiple pet support per user
- Health status tracking
- Microchip ID management
- Emergency contact information
- Photo upload and management

### 📅 Appointment System
- Veterinary appointment scheduling
- Status tracking (scheduled, confirmed, completed, cancelled)
- Appointment reminders
- Vet clinic and contact information
- Appointment history

### 🏥 Health Records
- Medical history tracking
- Vaccination records
- Treatment documentation
- Medication tracking
- Health reminders and alerts
- Veterinarian notes
- File attachments support

### 🔮 Planned Features
- Virtual consultations
- AI-powered symptom checker
- Community forum
- Insurance management
- Push notifications
- Mobile app support

## 🛠️ Tech Stack

### Backend Framework
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Express** - Web application framework

### Database & Storage
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Redis** - Caching and session storage
- **Cloudinary** - Image and file storage

### Authentication & Security
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **bcrypt** - Password hashing

### Background Processing
- **Bull** - Redis-based queue system
- **Node-cron** - Task scheduling

### Development Tools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Postman** - API testing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (recommended)
- **MongoDB** (v7 or higher)
- **Redis** (v6 or higher)
- **Git**

### System Requirements

- **OS**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/PawMundo-backend.git
cd PawMundo-backend
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/PawMundo

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. Start Required Services

#### MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or start local MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

#### Redis
```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Or start local Redis service
sudo systemctl start redis  # Linux
brew services start redis  # macOS
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3000 | No |
| `NODE_ENV` | Environment | development | No |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/PawMundo | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d | No |
| `REDIS_HOST` | Redis host | localhost | No |
| `REDIS_PORT` | Redis port | 6379 | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - | Yes |

### Database Configuration

The application uses MongoDB with Mongoose ODM. Database configuration is handled in `src/config/mongodb.config.ts`.

### Redis Configuration

Redis is used for caching and background job processing. Configuration is in `src/config/redis.config.ts`.

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Start in development mode with hot reload
pnpm run start:dev

# Or with npm
npm run start:dev
```

### Production Mode

```bash
# Build the application
pnpm run build

# Start in production mode
pnpm run start:prod
```

### Debug Mode

```bash
# Start in debug mode
pnpm run start:debug
```

The application will be available at `http://localhost:3000`

### Health Check

Once the application is running, you can verify it's working:

```bash
curl http://localhost:3000/health
```

## 📚 API Documentation

Detailed API documentation is available in the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file.

### Quick Start API Testing

1. **Register a new user:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

2. **Login to get access token:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

3. **Create a pet profile:**
```bash
curl -X POST http://localhost:3000/api/v1/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Buddy",
    "species": "dog",
    "breed": "Golden Retriever",
    "age": 3,
    "gender": "male"
  }'
```

### Postman Collection

Import the included Postman collection (`PawMundo_API.postman_collection.json`) for easy API testing.

## 🗄️ Database Schema

### User Schema
```typescript
{
  email: string (unique)
  password: string (hashed)
  firstName: string
  lastName: string
  role: 'user' | 'vet' | 'admin'
  phone?: string
  address?: string
  profileImage?: string
  isEmailVerified: boolean
  lastLogin?: Date
  isActive: boolean
  timestamps: { createdAt, updatedAt }
}
```

### Pet Schema
```typescript
{
  name: string
  species: string
  breed: string
  age: number
  gender: 'male' | 'female'
  weight?: number
  color?: string
  microchipId?: string
  profileImage?: string
  ownerId: ObjectId (ref: User)
  healthStatus: 'healthy' | 'sick' | 'recovering' | 'chronic'
  isActive: boolean
  timestamps: { createdAt, updatedAt }
}
```

### Appointment Schema
```typescript
{
  userId: ObjectId (ref: User)
  petId: ObjectId (ref: Pet)
  vetName: string
  vetClinic: string
  appointmentDate: Date
  appointmentTime: string
  reason: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  vetPhone?: string
  vetEmail?: string
  isActive: boolean
  timestamps: { createdAt, updatedAt }
}
```

### Health Record Schema
```typescript
{
  petId: ObjectId (ref: Pet)
  type: string
  title: string
  description?: string
  date: Date
  veterinarian?: string
  clinic?: string
  attachments?: string[]
  nextDueDate?: Date
  weight?: number
  temperature?: number
  heartRate?: number
  cost?: number
  notes?: string
  isReminder: boolean
  isActive: boolean
  timestamps: { createdAt, updatedAt }
}
```

## 🧪 Testing

### Running Tests

```bash
# Run unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:cov

# Run e2e tests
pnpm run test:e2e
```

### Test Structure

```
test/
├── e2e/                 # End-to-end tests
│   ├── auth.e2e-spec.ts
│   ├── pets.e2e-spec.ts
│   └── appointments.e2e-spec.ts
└── unit/                # Unit tests
    ├── auth.service.spec.ts
    ├── pets.service.spec.ts
    └── appointments.service.spec.ts
```

### Writing Tests

Example test structure:

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

## 🚀 Deployment

### Docker Deployment

1. **Build Docker image:**
```bash
docker build -t PawMundo-backend .
```

2. **Run with Docker Compose:**
```bash
docker-compose up -d
```

### Production Deployment

1. **Build the application:**
```bash
pnpm run build
```

2. **Set production environment variables**

3. **Start the application:**
```bash
pnpm run start:prod
```

### Environment-Specific Configurations

- **Development**: Hot reload, detailed logging
- **Staging**: Production-like environment for testing
- **Production**: Optimized performance, minimal logging

## 📁 Project Structure

```
PawMundo-backend/
├── src/
│   ├── common/              # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   ├── filters/         # Exception filters
│   │   ├── guards/          # Auth guards
│   │   ├── interceptors/    # Request/response interceptors
│   │   ├── pipes/           # Validation pipes
│   │   └── utils/           # Utility functions
│   ├── config/              # Configuration files
│   │   ├── cloudinary.config.ts
│   │   ├── mongodb.config.ts
│   │   └── redis.config.ts
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication module
│   │   ├── pets/            # Pet management module
│   │   ├── appointments/    # Appointment module
│   │   ├── health-records/  # Health records module
│   │   └── user/            # User management module
│   ├── app.module.ts        # Root application module
│   └── main.ts              # Application entry point
├── test/                    # Test files
├── .env.example             # Environment variables template
├── docker-compose.yml       # Docker composition
├── Dockerfile               # Docker configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```



### Code Style

- Use ESLint and Prettier configurations
- Follow NestJS conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

If you encounter any issues or have questions:

1. Check the [API Documentation](./API_DOCUMENTATION.md)
2. Search existing [GitHub Issues](https://github.com/yourusername/PawMundo-backend/issues)
3. Create a new issue with detailed information
4. Join our community discussions

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- MongoDB team for the robust database
- All contributors who help improve this project

---

**Made with ❤️ for pet lovers everywhere** 🐾