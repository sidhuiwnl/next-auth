import { connect } from "@/dbConfig/db";
import User from '@/models/userModels'
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import { sendMail } from "@/helpers/mailer";


connect()

export async function POST(request : NextRequest){
    try {
        const payload = await request.json()
        const { username ,password,email}  = payload
        console.log(payload)

        const isUser = await User.findOne({email})
        if(isUser){
            return NextResponse.json({msg : "User aldready exist"},{status : 404})
        }

        const salt  = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password : hashPassword
        })

        const saveduser = await newUser.save();
        console.log(saveduser)

        await sendMail({email,emailType : "VERIFY",userId : saveduser._id})
        return NextResponse.json({
            msg : "user registered successfully",
            sucess  :true
        })

    } catch (error:any) {
        return NextResponse.json({ message : error.message},{status : 500}
        )
    }
}
