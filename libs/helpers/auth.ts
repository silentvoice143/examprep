// libs/auth.ts

import { headers } from "next/headers";
import { verifyAccessToken } from "./jwt";

export async function getAuthUser() {
    const headersList =
        await headers();

    const authorization =
        headersList.get(
            "authorization"
        );

    if (!authorization) {
        throw new Error(
            "Unauthorized"
        );
    }

    const token =
        authorization.replace(
            "Bearer ",
            ""
        );

    return verifyAccessToken(token);
}