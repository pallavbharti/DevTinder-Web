import { Routes, Route } from 'react-router-dom'
import Body from './components/Body'
import Login from './components/Login'
import Profile from './components/Profile'
import { Provider } from 'react-redux'
import store from './utils/appStore'
import Feed from './components/Feed'
import Connections from './components/Connections'
import Requests from './components/Requests'
import Premium from './components/Premium'

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/connections" element={<Connections />} />
          {/* Chat ab alag page nahi — Messages screen ke andar khulta hai (WhatsApp jaisa) */}
          <Route path="/chat/:targetUserId" element={<Connections />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Provider>
  );
}

const NotFound = () => (
  <div className="text-center py-24">
    <h1 className="text-4xl font-semibold">Page not found</h1>
    <p className="mt-2 opacity-70">The link may be broken or the page was moved.</p>
  </div>
);

export default App;
