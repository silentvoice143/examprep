import bcrypt from "bcryptjs";

import { TokenPurpose } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";

export async function POST(req: Request) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return Response.json(
                {
                    success: false,
                    message: "Token and password are required",
                },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Password must be at least 8 characters",
                },
                { status: 400 }
            );
        }

        const resetToken =
            await prisma.userToken.findUnique({
                where: {
                    token,
                },
                include: {
                    user: true,
                },
            });

        if (!resetToken) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid reset link",
                },
                { status: 400 }
            );
        }

        if (
            resetToken.purpose !==
            TokenPurpose.PASSWORD_RESET
        ) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid token purpose",
                },
                { status: 400 }
            );
        }

        if (resetToken.expiresAt < new Date()) {
            return Response.json(
                {
                    success: false,
                    message: "Reset link has expired",
                },
                { status: 400 }
            );
        }

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        await prisma.$transaction([
            prisma.user.update({
                where: {
                    id: resetToken.userId,
                },
                data: {
                    password: hashedPassword,
                },
            }),

            prisma.userToken.delete({
                where: {
                    id: resetToken.id,
                },
            }),
        ]);

        return Response.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error(
            "RESET PASSWORD ERROR:",
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