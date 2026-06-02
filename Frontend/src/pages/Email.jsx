import React,{useState} from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Spinner} from "@/components/ui/spinner"
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate} from "react-router-dom";


function Email() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

   async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
 
    try{
      await axios.post('/api/v1/users/sendOTP', {email}, { withCredentials: true });
      toast.success("OTP sent successfully !");
      navigate("/verify-otp/",{
        state:{
            email
        }
      })
    } catch (err) {
      if(err?.response?.status === 404){
        toast.error("This email not found!")
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
        <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
        <CardDescription className="text-center">
          Please enter the registered email address to receive the OTP for verification.
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
            {loading ? <Button disabled>Sending OTP<Spinner data-icon="inline-start" /></Button> : <Button type="submit" className="w-full" size='lg'>Send OTP</Button>}
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}

export default Email
            