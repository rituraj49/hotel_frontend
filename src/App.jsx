import { useState } from 'react'
import './App.css'
import Button from '@mui/material/Button'
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import RoomsListPage from './pages/RoomsListPage';
import BookRoomPage from './pages/BookRoomPage';
import ReservationsPage from './pages/ReservationsPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  

  return (
    <>
      <Routes>
        <Route path={'/login'} element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route path='/rooms' element={<RoomsListPage />} />
          <Route path='/' element={<Navigate to="/rooms" replace />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/book/:roomId' element={<BookRoomPage />} />
            <Route path='/reservations' element={<ReservationsPage />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Route>
        </Route>

        {/* <Route path={'*'} element={<NoPageFound />}  /> */}

      </Routes>
    </>
  )
}

export default App;
