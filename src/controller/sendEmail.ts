import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "khalil.haouas@gmail.com",
        pass: process.env.PASSWORD,
    }
})


const sendEmail = async (email:string,firstName,verifyToken:string) => {
    await transporter.sendMail({
        from: "khalil.haouas@gmail.com",
        to:email,
        subject:"verify Account",
        text:"bitte clickn sir hier ",
        html:`      <div style="font-family: Arial, sans-serif; background-color: #F4F4F4; padding: 20px;">
                    <p>Dear ${firstName},</p>
                    <h1 style="color: #333;">Click the link below to verify your account</h1>
                    <img src='https://th.bing.com/th/id/OIP.cneIxMB7ie6Q1JkJoLB5zwHaE2?w=279&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7' alt='brand' width='40' height='40' />
                    <p style="color: #666;">Please click the link below to verify your account:</p>
                    <a href="http://localhost:3000/user/verify_account/${verifyToken}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Verify Account</a>
                </div>`

    })
}


export {sendEmail}