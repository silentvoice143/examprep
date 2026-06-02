import jwt, { JwtPayload } from "jsonwebtoken";

export const generateToken = (userId: string) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );
};

export const verifyAccessToken = (
    token: string
): JwtPayload => {
    return jwt.verify(
        token,
        process.env.JWT_SECRET!
    ) as JwtPayload;
};

export const generateOtp = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};