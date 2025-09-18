# 📊 Real-Time Polling Application API

A backend service for creating polls, voting, and getting **live results in real-time** using **WebSockets**.  
Built with **Node.js, Express, Prisma, PostgreSQL, and Socket.IO**.

---

## Tech Stack
    - Backend Framework : Node.js with Express.js  
    - Database : PostgreSQL  
    - ORM : Prisma  
    - Authentication: JWT + bcryptjs  
    - Real-time Communication : Socket.IO  


## Getting Started

## 1. Clone the Repository
 - git clone https://github.com/coder-nitin07/realtime-polling-app
 - cd realtime-polling-app

## 2. Install Dependencies
npm install


# Database Setup

# 1. Initialize Prisma
npx prisma init

# 2. Run Migrations
npx prisma migrate dev --name init

# 3. Generate Prisma Client
npx prisma generate


# 4. Run the Server
npm run dev




# Authentication
    - JWT-based authentication
    - Include token in header:
        Authorization: Bearer <your-token>


# API Endpoints
    a. Users
        - Register → POST /users
            {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "mypassword"
            }

        - Login → POST /auth/login
            {
                "email": "john@example.com",
                "password": "mypassword"
            }

        
        - Response: 
            {
               "token": "your-jwt-token"
            }



# Polls
    a. Create Poll → POST /polls (Auth required)
        {
            "question": "What is your favorite language?",
            "options": ["JavaScript", "Python", "C++"]
        }


    b. Get All Polls → GET /polls

    c. Get Poll by ID → GET /polls/:id



# Votes
    # Vote on Poll → POST /votes/:id/vote (Auth required)
        {
            "optionId": 2
        }



# WebSocket Usage (Real-Time Updates)
    - Connect
        ws://localhost:3000

    - Events
        - joinPoll → Join a poll room
        socket.emit("joinPoll", 1); // 1 = pollId


    - pollUpdated → Receive updated poll results automatically
        socket.on("pollUpdated", (data) => {
            console.log("Updated Results:", data);
        });

    

# Testing Guide
    1. Open Postman and test:
        - Register/Login
        - Create Poll
        - Vote on Poll
        - Fetch Polls

    2. Open Socket.IO Tester (online):
        - Connect to ws://localhost:3000
        - Send:
            ["joinPoll", 1]

        - Cast a vote in Postman → See live updates appear.






# Features
    - User authentication with JWT
    - Create polls with multiple options
    - Cast votes with validation (no duplicate votes)
    - Fetch polls & results
    - Real-time updates with WebSocket

# Submission Notes
    - Make sure PostgreSQL is running locally.
    - Use npx prisma migrate dev before starting the server.
    - WebSocket events tested via Socket.IO Tester.