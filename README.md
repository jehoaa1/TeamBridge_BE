# MajorOne

Employee management and WebRTC chat system built with NestJS.

## Features

- Employee Management (CRUD operations)
- JWT Authentication
- WebRTC 1:1 Chat
- MongoDB Integration
- Swagger Documentation

## Prerequisites

- Node.js (v16 or later)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/majorone.git
cd majorone
```

2. Install dependencies
```bash
npm install
```

3. Create .env file
```bash
cp .env.example .env
```

4. Update .env file with your configuration
```bash
MONGODB_URI=mongodb://localhost:27017/majorone
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d
PORT=3000
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## API Endpoints

### Authentication
- POST /auth/register - Register a new user
- POST /auth/login - Login user

### Employees
- GET /employees - Get all employees
- POST /employees - Create a new employee
- GET /employees/:id - Get employee by id
- PUT /employees/:id - Update employee
- DELETE /employees/:id - Delete employee

### WebRTC Chat
WebSocket endpoints for WebRTC signaling:
- ws://localhost:3000

## License

This project is licensed under the MIT License. #   T e a m B r i d g e _ B E  
 