import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
import User from '@/models/userModels'





export const sendMail  = async({email,emailType,userId} :any) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(),10)

        if(emailType === 'VERIFY'){
            await User.findByIdAndUpdate(userId,
                {verifyToken : hashedToken,verifyTokenExpiry:Date.now() + 3600000}
                )
        }
        else if(emailType === 'RESET'){
            await User.findByIdAndUpdate(userId,
                {forgotPasswordToken : hashedToken,forgotPasswordTokenExpiry:Date.now() + 3600000}
                )
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "4bd66c0dd7212c",
              pass: "1138f9c3ffac17"
            }
          });

        const mailOptions = {
            from: "sidharth@gmail.com", // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "verify your email" : "Reset your password", // Subject line
            
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} </p>`, // html body
        }

        const mailResponse = await transport.sendMail(mailOptions)

        return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }

}