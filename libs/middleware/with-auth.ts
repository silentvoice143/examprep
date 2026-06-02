// libs/with-auth.ts

import { getAuthUser } from "./auth";

export function withAuth(
    handler: (
        req: Request,
        user: {
            userId: string;
            email: string;
        }
    ) => Promise<Response>
) {
    return async (
        req: Request
    ) => {
        try {
            const user =
                await getAuthUser();

            return handler(
                req,
                user
            );
        } catch {
            return Response.json(
                {
                    success: false,
                    message:
                        "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }
    };
}