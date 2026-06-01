import { generateOtp } from "@/libs/helpers/jwt";
import { prisma } from "@/libs/prisma";
import { sendOTPEmail } from "@/libs/services/email.service";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return Response.json(
                { success: false, message: "Email already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOtp();

        const otpExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpiresAt,
            },
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await sendOTPEmail({ email, otp })

        return Response.json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}