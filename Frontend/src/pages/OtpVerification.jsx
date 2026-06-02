import React,{useState, useEffect} from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {Spinner} from "@/components/ui/spinner"
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate, useLocation} from "react-router-dom";


function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email;
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(()=>{

   if(!email){
      navigate("/")
   }

  },[email, navigate])

   async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if(otp.length !== 6) {
        toast.error("Please enter complete OTP")
        setLoading(false)
        return
    }
 
    try{
      await axios.post('/api/v1/users/verifyOTP', {email,otp}, { withCredentials: true });
      toast.success("OTP verified successfully!");
      navigate("/reset-password",{
        state:{
            email
        }
      })
    } catch (err) {
      if(err?.response?.status === 400){
        toast.error("Otp is invalid or expired!")
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
        <CardTitle className="text-2xl font-bold text-center">OTP Verification</CardTitle>
        <CardDescription className="text-center">
          Please enter the OTP sent to {email} for verification.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center">
              <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} className="border-gray-700"/>
                    <InputOTPSlot index={1} className="border-gray-700"/>
                    <InputOTPSlot index={2} className="border-gray-700"/>
                    <InputOTPSlot index={3} className="border-gray-700"/>
                    <InputOTPSlot index={4} className="border-gray-700"/>
                    <InputOTPSlot index={5} className="border-gray-700"/>
                </InputOTPGroup>
            </InputOTP>
            </div>
            {loading ? <Button disabled>Verifying OTP<Spinner data-icon="inline-start" /></Button> : <Button type="submit" className="w-full" size='lg' disabled={loading || otp.length !== 6}>Verify OTP</Button>}
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}

export default OtpVerification
            