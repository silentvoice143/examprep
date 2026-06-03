import { TokenPurpose } from "@/generated/prisma/enums";
import { prisma } from "@/libs/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const token = searchParams.get("token");

        if (!token) {
            return Response.json(
                {
                    success: false,
                    message: "Verification token is required",
                },
                { status: 400 }
            );
        }

        const verificationToken =
            await prisma.userToken.findUnique({
                where: {
                    token,
                },
                include: {
                    user: true,
                },
            });


        if (!verificationToken) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification link",
                },
                { status: 400 }
            );
        }

        if (
            verificationToken.purpose !==
            TokenPurpose.EMAIL_VERIFICATION
        ) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid token purpose",
                },
                { status: 400 }
            );
        }

        if (
            verificationToken.expiresAt <
            new Date()
        ) {
            return Response.json(
                {
                    success: false,
                    message: "Verification link expired",
                },
                { status: 400 }
            );
        }

        await prisma.$transaction([
            prisma.user.update({
                where: {
                    id: verificationToken.userId,
                },
                data: {
                    isEmailVerified: true,
                },
            }),

            prisma.userToken.delete({
                where: {
                    id: verificationToken.id,
                },
            }),
        ]);

        return Response.json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error("VERIFY EMAIL ERROR:", error);

        return Response.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}