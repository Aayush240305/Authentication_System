import transporter from "../transporter.js";
import {apiError} from "./apiError.js";

const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Your OTP for verification',
            html: `
<div style="
   max-width:500px;
   margin:auto;
   padding:30px;
   background:#ffffff;
   border:1px solid #e5e7eb;
   border-radius:12px;
   font-family:Arial,sans-serif;
">

   <div style="text-align:center;">

      <h1 style="
         color:#2563eb;
         margin-bottom:10px;
      ">
         OTP Verification
      </h1>

      <p style="
         color:#4b5563;
         font-size:15px;
         margin-bottom:25px;
      ">
         Use the OTP below to continue.
      </p>

      <div style="
         background:#f3f4f6;
         padding:18px;
         border-radius:10px;
         font-size:32px;
         font-weight:bold;
         letter-spacing:6px;
         color:#111827;
         margin-bottom:25px;
      ">
         ${otp}
      </div>

      <p style="
         color:#ef4444;
         font-size:14px;
         margin-bottom:20px;
      ">
         This OTP is valid for 5 minutes.
      </p>

      <hr style="
         border:none;
         border-top:1px solid #e5e7eb;
         margin:20px 0;
      " />

      <p style="
         color:#6b7280;
         font-size:13px;
         line-height:1.6;
      ">
         If you did not request this OTP,
         please ignore this email.
      </p>

   </div>

</div>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error(`Error sending OTP to ${email}:`, error);
        throw new apiError('Failed to send OTP', 500);
    }
};

export {sendOTP};