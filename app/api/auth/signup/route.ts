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
            if (!existingUser.isEmailVerified) {
                const otp = generateOtp();

                await prisma.user.update({
                    where: { email },
                    data: {
                        otp,
                        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
                    },
                });

                await sendOTPEmail({ email, otp });

                return Response.json({
                    success: true,
                    requiresVerification: true,
                    message: "Verification pending. New OTP sent.",
                });
            }

            return Response.json(
                {
                    success: false,
                    message: "Email already exists",
                },
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