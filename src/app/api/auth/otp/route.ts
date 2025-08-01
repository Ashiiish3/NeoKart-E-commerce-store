import { NextRequest, NextResponse } from "next/server";
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceSid = process.env.TWILIO_SERVICE_SID

const client = twilio(accountSid, authToken);

// for sending otp to sms using twilio
export async function POST(req: NextRequest) {
    try {
        const {phoneNumber} = await req.json()
        if(!phoneNumber){
            return NextResponse.json({message: "Phone number is required.", success: false})
        }
        const verification = await client.verify.v2.services(serviceSid as string).verifications.create({
            to:`+91${phoneNumber}`,
            channel: "sms"
        })
        console.log("verification" , verification)
        return NextResponse.json({message: "OTP send successfully.", success: true, sid: verification.sid})
    } catch (error) {
        return NextResponse.json({message: "error while sending otp", error, success: false})
    }
}