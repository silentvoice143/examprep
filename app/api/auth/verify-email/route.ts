import { prisma } from "@/libs/prisma";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (user.otp !== otp) {
            return Response.json(
                { success: false, message: "Invalid OTP" },
                { status: 400 }
            );
        }

        if (
            !user.otpExpiresAt ||
            user.otpExpiresAt < new Date()
        ) {
            return Response.json(
                { success: false, message: "OTP expired" },
                { status: 400 }
            );
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                otp: null,
                otpExpiresAt: null,
            },
        });

        return Response.json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}