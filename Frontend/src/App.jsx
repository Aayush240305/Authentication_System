import React from 'react'
import {Routes, Route} from "react-router-dom"
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import Email from './pages/Email.jsx'
import OtpVerification from './pages/OtpVerification.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import { ToastContainer} from 'react-toastify';

function App() {

  return (
  <>
   <Routes>
    <Route path='/' element={<Login />} />
    <Route path='/signup' element={<Signup />} />
    <Route path='/home' element={<Home />} />
    <Route path='/email' element={<Email />}/>
    <Route path='/verify-otp' element={<OtpVerification />}/>
    <Route path='/reset-password' element={<ResetPassword />}/>
   </Routes>
    <ToastContainer theme="dark"/>
   </>
  )
}

export default App
