import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login/Login';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
import Password from './pages/auth/Password/Password';
import Profile from './pages/auth/Profile/Profile';
import ToastContainer from './components/notification/ToastContainer';

export function App() {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login rememberMe={rememberMe} setRememberMe={setRememberMe} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password" element={<Password />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
