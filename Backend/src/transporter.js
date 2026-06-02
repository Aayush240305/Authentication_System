import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.MAILUSER, process.env.MAILPASS);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASS
    }
});

export default transporter;