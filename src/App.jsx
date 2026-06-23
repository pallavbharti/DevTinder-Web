import { Routes, Route } from 'react-router-dom'
import Body from './Body'
import Login from './Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Body />}>
        <Route path="/" element={<h1>Feed Page</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<h1>Profile Page</h1>} />
        <Route path="/connections" element={<h1>Connections Page</h1>} />
      </Route>
    </Routes>
  );
}

export default App;