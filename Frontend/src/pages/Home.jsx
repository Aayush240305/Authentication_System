import React,{useState, useEffect} from 'react'
import { Avatar,AvatarImage} from '@/components/ui/avatar'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react';
import { ReactTyped } from 'react-typed';

function Home() {

  const [name, setName] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try{
        const res = await axios.get("/api/v1/users/getUser", { withCredentials: true });
        setName(res.data.data.name)
      }catch(err){
        toast.error("Please login to access this page or your session has expired")
        navigate("/")
      }
    }
    fetchUser();
  },[navigate])

  async function handleLogout() {
    await axios.post("/api/v1/users/logout", {},{ withCredentials: true })
            .then(() => {
              toast.success("Logged out successfully")
              navigate("/")
            })
            .catch(() => {
              toast.error("Error logging out")
            })
    }


  return (
    <>
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <img src="/logoAuth.png" alt="Logo" className="h-16 p-0 m-0" />
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Avatar>
        <AvatarImage
          src={`https://ui-avatars.com/api/?name=${name}&background=111827&color=14B8A6`}
          alt="name"
          className="grayscale"
        />
      </Avatar>
            <p>{name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className='mr-2' />
            Logout
          </Button>
        </div>
      </div>
    </nav>
    <div className="flex flex-col items-center justify-center text-center px-2 py-6">

  <img
    src="/robot.gif"
    alt="Robot"
    className="h-64"
  />

  <h2 className="text-3xl md:text-4xl font-bold mt-8 text-gray-800">

          Hey, <span className="text-cyan-500">{name}!</span> 

  </h2>

  <h1 className="text-5xl md:text-7xl font-extrabold mt-5 leading-tight bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 bg-clip-text text-transparent">
    <ReactTyped
      strings={["Welcome to our App!"]}
      typeSpeed={50}
      backSpeed={30}
      loop
    />
  </h1>

  <p className="mt-5 text-gray-600 max-w-2xl text-lg leading-relaxed">
    This is a simple app to demonstrate authentication
    and user management using modern web technologies.
  </p>

</div>
    </>
  )
}

export default Home