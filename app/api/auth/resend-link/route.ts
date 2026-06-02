import crypto from "crypto";

import { TokenPurpose } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";
import { sendActionEmail } from "@/libs/services/email.service";

export async function POST(req: Request) {
    try {
        const { email, purpose } = await req.json();

        if (!email || !purpose) {
            return Response.json(
                {
                    success: false,
                    message: "Email and purpose are required",
                },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
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

        const token = crypto
            .randomBytes(32)
            .toString("hex");

        let expiresAt: Date;
        let link: string;
        let successMessage: string;

        let emailConfig: {
            subject: string;
            title: string;
            description: string;
            buttonText: string;
            expiryText: string;
        };

        switch (purpose) {
            case TokenPurpose.EMAIL_VERIFICATION:
                if (user.isEmailVerified) {
                    return Response.json(
                        {
                            success: false,
                            message:
                                "Email already verified",
                        },
                        { status: 400 }
                    );
                }

                expiresAt = new Date(
                    Date.now() +
                    24 * 60 * 60 * 1000
                );

                link = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

                successMessage =
                    "Verification link sent successfully";

                emailConfig = {
                    subject:
                        "Verify Your Email - ExamEdge",
                    title: "Verify Your Email",
                    description:
                        "Thank you for joining ExamEdge. Click the button below to verify your email address and activate your account.",
                    buttonText:
                        "Verify Email",
                    expiryText:
                        "This verification link will expire in 24 hours.",
                };

                break;

            case TokenPurpose.PASSWORD_RESET:
                if (!user.isEmailVerified) {
                    return Response.json(
                        {
                            success: false,
                            message:
                                "Please verify your email first",
                        },
                        { status: 400 }
                    );
                }

                expiresAt = new Date(
                    Date.now() +
                    15 * 60 * 1000
                );

                link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

                successMessage =
                    "Password reset link sent successfully";

                emailConfig = {
                    subject:
                        "Reset Your Password - ExamEdge",
                    title:
                        "Reset Your Password",
                    description:
                        "We received a request to reset your password. Click the button below to create a new password.",
                    buttonText:
                        "Reset Password",
                    expiryText:
                        "This password reset link will expire in 15 minutes.",
                };

                break;

            default:
                return Response.json(
                    {
                        success: false,
                        message:
                            "Invalid token purpose",
                    },
                    { status: 400 }
                );
        }

        await prisma.$transaction([
            prisma.userToken.deleteMany({
                where: {
                    userId: user.id,
                    purpose,
                },
            }),

            prisma.userToken.create({
                data: {
                    token,
                    purpose,
                    expiresAt,
                    userId: user.id,
                },
            }),
        ]);

        await sendActionEmail({
            email: user.email,
            subject: emailConfig.subject,
            title: emailConfig.title,
            description:
                emailConfig.description,
            buttonText:
                emailConfig.buttonText,
            actionLink: link,
            expiryText:
                emailConfig.expiryText,
        });

        return Response.json(
            {
                success: true,
                message: successMessage,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "SEND LINK ERROR:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Internal server error",
            },
            { status: 500 }
        );
    }
}