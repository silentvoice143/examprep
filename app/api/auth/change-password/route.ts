import bcrypt from "bcryptjs";
import { prisma } from "@/libs/prisma";
import { withAuth } from "@/libs/middleware/with-auth";

export const POST = withAuth(
    async (req, authUser) => {
        const {
            oldPassword,
            newPassword,
        } = await req.json();

        const user =
            await prisma.user.findUnique(
                {
                    where: {
                        id: authUser.userId,
                    },
                }
            );

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message:
                        "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        const valid =
            await bcrypt.compare(
                oldPassword,
                user.password
            );

        if (!valid) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Incorrect password",
                },
                {
                    status: 400,
                }
            );
        }

        const hashed =
            await bcrypt.hash(
                newPassword,
                10
            );

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashed,
            },
        });

        return Response.json({
            success: true,
            message:
                "Password updated",
        });
    }
);