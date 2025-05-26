import { useEffect, useState } from 'react'
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
import keycloak from './config/keycloak';
import { useKeycloakInit } from './config/KeycloakProvider';
import axios from 'axios';
import { ReactKeycloakProvider } from '@react-keycloak/web';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState("");
  // const { keycloakReady } = useKeycloakInit();

  // if(!keycloakReady) return <p>loading keycloak</p>

  async function resourceCall () {
      const res = await fetch("http://localhost:8082/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      console.log("data recvd: ", data);
  }
  // useEffect(() => {
  //   keycloak.init({
  //     onLoad: 'login-required',
  //     checkLoginIframe: false
  //   }).then((authenticated) => {
  //     setIsAuth(authenticated);
  //     if(authenticated) {
  //       console.log('jwt token: ', keycloak.token);
  //       console.log("user  info: ", keycloak.tokenParsed);
  //       setToken(keycloak.token);
  //     }
  //   });
  // }, []);

  const handleOnEvent = (e) => {
    console.log("event: ", e);
    if(e === "onReady") {
      console.log("keycloak ready");
    } else if(e === "onAuthSuccess") {
      console.log("auth success");
      setToken(keycloak.token);
      setIsAuth(true);
    }
  }

  return (
    <>
    <ReactKeycloakProvider 
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        checkLoginIframe: false
      }}
      onEvent={handleOnEvent}
    >
      <Button onClick={() => console.log(keycloak)}>keycloak</Button>
      <Button onClick={() => resourceCall()}>resource call</Button>
      {/* <Button onClick={() => {
        const { keycloakReady } = useKeycloakInit();
        console.log(keycloakReady);
      }}>keycloak use</Button> */}
      {/* <Routes>
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
      </Routes> */}
    </ReactKeycloakProvider>
        {/* <Route path={'*'} element={<NoPageFound />}  /> */}
    </>
  )
}

export default App;
