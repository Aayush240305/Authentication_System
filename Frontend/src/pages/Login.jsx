import React,{useState} from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Spinner} from "@/components/ui/spinner"
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link, useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

   async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
 
    try{
      await axios.post('/api/v1/users/login', {email, password}, { withCredentials: true });
      toast.success("Login Successful !");
      navigate("/home")
    } catch (err) {
      if(err?.response?.status === 400){
        toast.error("User Not Found !")
      }else if(err?.response?.status === 401){
        toast.error("Incorrect Password!")
      }else{
        toast.error("Something went wrong!")
      }
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center">
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Welcome back! Please enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/email"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required  value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            {loading ? <Button disabled>Logging In<Spinner data-icon="inline-start" /></Button> : <Button type="submit" className="w-full" size='lg'>Login</Button>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Don't have an account?
          <Button variant="link" className="ml-1 pl-0">
          <Link to="/signup" className="ml-0 pl-0">
            Sign Up
          </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
    </div>
  )
}

export default Login
            