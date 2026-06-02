import React,{useState,useEffect} from 'react'
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
import {useNavigate, useLocation} from "react-router-dom";


function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const location = useLocation();
  const email = location?.state?.email;

  useEffect(()=>{

   if(!email){
      navigate("/")
   }

  },[email, navigate])

   async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if(newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
 
    try{
      await axios.patch('/api/v1/users/resetPassword', {email, newPassword}, { withCredentials: true });
      toast.success("Password Reset Successfully!");
      navigate("/")
    } catch (err) {
        console.log(err)
        toast.error("Something went wrong!")
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center">
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Please enter new password for resetting it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">New Password</Label>
              </div>
              <Input id="password" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
          <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirm-password">Confirm Password</Label>
              </div>
              <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            {loading ? <Button disabled>Resetting Password<Spinner data-icon="inline-start" /></Button> : <Button type="submit" className="w-full" size='lg'>Reset Password</Button>}
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}

export default ResetPassword
            