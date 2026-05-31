import React from 'react'
import {Routes, Route} from "react-router-dom"
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import { ToastContainer} from 'react-toastify';

function App() {

  return (
  <>
   <Routes>
    <Route path='/' element={<Login />} />
    <Route path='/signup' element={<Signup />} />
    <Route path='/home' element={<Home />} />
   </Routes>
    <ToastContainer theme="dark"/>
   </>
  )
}

export default App
