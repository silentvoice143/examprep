// app/api/auth/resend-otp/route.ts

import { generateOtp } from "@/libs/helpers/jwt";
import { prisma } from "@/libs/prisma";
import { sendOTPEmail } from "@/libs/services/email.service";



export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return Response.json(
                {
                    success: false,
                    message: "Email is required",
                },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        if (user.isEmailVerified) {
            return Response.json(
                {
                    success: false,
                    message: "Email is already verified",
                },
                { status: 400 }
            );
        }

        if (
            user.otp &&
            user.otpExpiresAt &&
            user.otpExpiresAt > new Date()
        ) {
            const remainingSeconds = Math.ceil(
                (user.otpExpiresAt.getTime() -
                    Date.now()) /
                1000
            );

            return Response.json(
                {
                    success: false,
                    message:
                        "OTP already sent. Please wait for it to expire.",
                    remainingSeconds,
                },
                { status: 400 }
            );
        }

        const otp = generateOtp();

        const otpExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                otp,
                otpExpiresAt,
            },
        });

        await sendOTPEmail({ email: user.email, otp });

        return Response.json(
            {
                success: true,
                message: "OTP sent successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "RESEND OTP ERROR:",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}