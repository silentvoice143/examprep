import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/libs/helpers/jwt";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return Response.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordValid) {
            return Response.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (!user.isEmailVerified) {
            return Response.json(
                {
                    success: false,
                    message: "Email not verified",
                },
                { status: 403 }
            );
        }

        const token = generateToken(user.id);

        return Response.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}