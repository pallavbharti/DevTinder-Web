import { Routes, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./utils/appStore";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Premium from "./components/Premium";
import Chat from "./components/Chat";
import { EmptyState } from "./components/ui/States";
import { CodeIcon } from "./components/ui/Icons";

const NotFound = () => (
  <EmptyState
    icon={CodeIcon}
    title="404 — route not found"
    text="This page returned undefined. Let's get you back to the feed."
    action={<Link to="/" className="btn btn-primary">Back to feed</Link>}
  />
);

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<Feed />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="feed" element={<Feed />} />
          <Route path="connections" element={<Connections />} />
          <Route path="requests" element={<Requests />} />
          <Route path="premium" element={<Premium />} />
          <Route path="chat/:targetUserId" element={<Chat />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;
