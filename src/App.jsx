import { Routes, Route } from 'react-router-dom'
import Body from './components/Body'
import Login from './components/Login'
import Profile from './components/Profile'
import { Provider } from 'react-redux'
import store from './utils/appStore'
import Feed from './components/Feed'

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route path="/" element={<h1>Feed Page</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/connections" element={<h1>Connections Page</h1>} />
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;