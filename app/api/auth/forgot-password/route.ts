import crypto from "crypto";

import { TokenPurpose } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";
import { sendActionEmail } from "@/libs/services/email.service";


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
            where: {
                email,
            },
        });

        // Don't reveal whether user exists
        if (!user) {
            return Response.json({
                success: true,
                message:
                    "If an account exists with this email, a reset link has been sent.",
            });
        }

        if (!user.isEmailVerified) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Please verify your email before resetting your password.",
                },
                { status: 400 }
            );
        }

        await prisma.userToken.deleteMany({
            where: {
                userId: user.id,
                purpose: TokenPurpose.PASSWORD_RESET,
            },
        });

        const resetToken =
            crypto.randomBytes(32).toString("hex");

        await prisma.userToken.create({
            data: {
                token: resetToken,
                purpose: TokenPurpose.PASSWORD_RESET,
                expiresAt: new Date(
                    Date.now() + 15 * 60 * 1000 // 15 minutes
                ),
                userId: user.id,
            },
        });

        const resetLink =
            `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

        await sendActionEmail({
            email,
            subject: "Reset Your Password - ExamEdge",
            title: "Reset Your Password",
            description:
                "We received a request to reset your password. Click the button below to continue.",
            buttonText: "Reset Password",
            actionLink: resetLink,
            expiryText: "This password reset link will expire in 15 minutes.",
        });

        return Response.json({
            success: true,
            message:
                "If an account exists with this email, a reset link has been sent.",
        });
    } catch (error) {
        console.error(
            "FORGOT PASSWORD ERROR:",
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