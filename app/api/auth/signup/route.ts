import crypto from "crypto";
import bcrypt from "bcryptjs";

import { TokenPurpose } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";
import { sendVerificationEmail } from "@/libs/services/email.service";

export async function POST(req: Request) {
    try {
        const { name, email, password, phone } = await req.json();

        if (!name || !email || !password || !phone) {
            return Response.json(
                {
                    success: false,
                    message: "All fields are required",
                },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            if (existingUser.isEmailVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Email already exists",
                    },
                    { status: 400 }
                );
            }

            // delete old verification tokens
            await prisma.userToken.deleteMany({
                where: {
                    userId: existingUser.id,
                    purpose: TokenPurpose.EMAIL_VERIFICATION,
                },
            });

            const verificationToken =
                crypto.randomBytes(32).toString("hex");

            await prisma.userToken.create({
                data: {
                    token: verificationToken,
                    purpose: TokenPurpose.EMAIL_VERIFICATION,
                    expiresAt: new Date(
                        Date.now() + 24 * 60 * 60 * 1000
                    ),
                    userId: existingUser.id,
                },
            });

            const verificationLink =
                `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

            await sendVerificationEmail({
                email,
                verificationLink,
            });

            return Response.json({
                success: true,
                requiresVerification: true,
                message:
                    "Account already exists but email is not verified. Verification link sent.",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
            },
        });

        const verificationToken =
            crypto.randomBytes(32).toString("hex");

        await prisma.userToken.create({
            data: {
                token: verificationToken,
                purpose: TokenPurpose.EMAIL_VERIFICATION,
                expiresAt: new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                ),
                userId: user.id,
            },
        });

        const verificationLink =
            `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

        await sendVerificationEmail({
            email,
            verificationLink,
        });

        return Response.json(
            {
                success: true,
                requiresVerification: true,
                message:
                    "Account created successfully. Please verify your email.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("SIGNUP ERROR:", error);

        return Response.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}