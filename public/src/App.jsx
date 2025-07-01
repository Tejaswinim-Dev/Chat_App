import React from 'react';
import {BrowserRouter,Routes,Route}  from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import SetAvatar from './pages/SetAvatar';
import Welcome from './pages/Welcome';
import Verify from './pages/Verify';

function App() {
  return (
  <BrowserRouter>
    <Routes>
        <Route path='/register' element={<Register/>} />
        <Route path='/' element={<Login/>} />
        <Route path='/chat' element={<Chat/>} />
        <Route path='/setAvatar' element={<SetAvatar/>} />
        <Route path='/welcome' element={<Welcome/>} />
        <Route path='/verify-otp' element={<Verify/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App

