# DevTinder

- Create a Vite + React application
- Remove unecessary code and create a Hello World app
- Install Tailwind CSS
- Install Daisy UI
- Add NavBar component to App.jsx
- Create a NavBar.jsx separate Component file
- Install react router dom
- Create BrowserRouter > Routes > Route=/ Body > RouteChildren
- Create an Outlet in your Body Component
- Create a footer

- Create a Login Page
- Install axios
💡 CORS - install cors in backend ⇒ add middleware with configurations: origin, credentials: true
- Whenever you're making API call so pass axios ⇒ { withCredentials: true }

- install react-redux + @reduxjs/toolkit - https://redux-toolkit.js.org/tutorials/quick-start
- configureStore ⇒ Provider ⇒ createSlice ⇒ add reducer to store
- Add redux devtools in chrome
- Login and see if your data is coming properly in the store
- NavBar should update as soon as user logs in
- Refactor our code to add constants file + create a components folder
- You should not be access other routes without login
- If token is not present, redirect user to login page
- Logout
- Profile Page



Body
    NavBar
    Route=/  ⇒ Feed
    Route=/login  ⇒ Login
    Route=/connetions ⇒ Connections
    Router=/profile ⇒ Profile






# Step 1: Vite + React project create
npm create vite@latest devtinder-web -- --template react
cd devtinder-web
npm install
npm run dev

# Step 3: Tailwind CSS install
npm install tailwindcss @tailwindcss/vite

# Step 4: Daisy UI install
npm install daisyui@latest

# Step 7: React Router DOM (abhi karna hai)
npm install react-router-dom