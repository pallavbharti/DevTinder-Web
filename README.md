# DevTinder Frontend

DevTinder is a Tinder-inspired networking application for developers where users can discover other developers, send connection requests, manage connections, and chat in real time.

This repository contains the frontend of DevTinder.

## Tech Stack

- React
- Vite
- React Router DOM
- Redux Toolkit
- Axios
- Tailwind CSS
- DaisyUI
- Socket.IO Client

## Features

### Authentication
- User Login
- User Logout
- Protected Routes
- Cookie-based authentication
- Redirect unauthenticated users to the Login page

### Feed
- View developer profiles
- Send connection requests
- Ignore developer profiles
- Redux-based feed state management

### Profile
- View Profile
- Edit Profile
- Update user information
- Toast message after profile update

### Connections
- View all connections
- View received connection requests
- Accept connection requests
- Reject connection requests

### Real-Time Chat
- One-to-one real-time messaging using Socket.IO
- Private chat rooms
- Send and receive messages instantly
- Persist messages in MongoDB through the backend
- Fetch previous chat history
- Previous messages remain available after page refresh
- Display message timestamps

## React Concepts Used

- Components
- Props
- useState
- useEffect
- useParams
- useNavigate
- useSelector
- Redux Toolkit
- Conditional Rendering
- Optional Chaining
- Array.map()
- Array.find()
- Spread Operator
- Object Destructuring
- Async/Await

## Application Structure

```text
Body
├── NavBar
├── Outlet
│   ├── Feed
│   ├── Login
│   ├── Profile
│   ├── Connections
│   ├── Requests
│   └── Chat
└── Footer