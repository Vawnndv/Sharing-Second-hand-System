import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/home/Home';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login/Login';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
import Password from './pages/auth/Password/Password';
import Profile from './pages/auth/Profile/Profile';
import ToastContainer from './components/notification/ToastContainer';
import Order from './pages/order/OrderStatus/Order';
import ViewDetailOrder from './pages/order/Viewdetail/ViewDetailOrder';
import History from './pages/order/History/History';
import ChatScreen from './pages/chat/ChatScreen';
import ChatRoom from './pages/chat/ChatRoom';
import InventoryScreen from './pages/inventory/InventoryScreen';
import Layout from './layout/Layout';
import ViewPostDetail from './pages/post/postDetail/ViewPostDetail';
import { AdminProtectedRouter, ProtectedRouter } from './ProtectedRouter';
import ViewInventoryDetail from './pages/inventory/ViewInventoryDetail';
import Statistic from './pages/statistic/Statistic';
import Users from './pages/Admin/users/Users';
import Collaborators from './pages/Admin/collaborations/Collaborations';
import MapSelectWarehouses from './components/Map/MapSelectWarehouses';

export function App() {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <Routes> 
      <Route path="/login" element={<Login rememberMe={rememberMe} setRememberMe={setRememberMe} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path='/' element={<Layout/>}>
        <Route path="*" element={<NotFound />} />
        <Route element={<ProtectedRouter />}>
          <Route index element={<Home />} />
          <Route path="/password" element={<Password />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order/:orderid" element={<ViewDetailOrder />} />
          <Route path="/history" element={<History />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/chat/:roomid" element={<ChatRoom />} />
          <Route path="/inventory" element={<InventoryScreen />} />
          <Route path="/inventory/:orderid" element={<ViewInventoryDetail />} />
          <Route path="/statistic" element={<Statistic />} />
        </Route>
        {/* <Route element={<AdminProtectedRouter />}>

        </Route> */}
          {/* <Route path="/order" element={<Order />} /> */}
          <Route path="/post/:postid" element={<ViewPostDetail />} />
          <Route element={<AdminProtectedRouter />}>
            <Route path="/users" element={<Users />} />
            <Route path="/collaborators" element={<Collaborators />} />
            <Route path="/SelectWarehouses" element={<MapSelectWarehouses />} />
          </Route>
        </Route>
    </Routes>
  );
}

export function WrappedApp() {
  return (
    <>
    <ToastContainer />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </>
  );
}
