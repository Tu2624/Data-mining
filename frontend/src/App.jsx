import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import useStore from './store/useStore';
import { io } from 'socket.io-client';

const App = () => {
  const { user, addNotification } = useStore();

  useEffect(() => {
    if (user) {
      const socket = io('http://localhost:5000');
      socket.emit('join_room', user.id);

      socket.on('new_notification', (notification) => {
        addNotification(notification);
        // Simple toast or alert can be added here
        console.log('New notification:', notification);
      });

      return () => socket.disconnect();
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
