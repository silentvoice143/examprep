// app/verify-email/page.tsx

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface VerifyEmailPageProps {
    searchParams: Promise<{
        token?: string;
    }>;
}

const VerifyEmail = async ({ searchParams }: VerifyEmailPageProps) => {
    const { token } = await searchParams;

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-semibold">Invalid Verification Link</h1>
                    <p className="text-muted-foreground mt-2">
                        Verification token is missing.
                    </p>
                </div>
            </div>
        );
    }

    let success = false;
    let message = "";

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`,
            {
                method: "GET",
                cache: "no-store",
            }
        );

        const data = await response.json();

        success = data.success;
        message = data.message;
    } catch (error) {
        success = false;
        message = "Something went wrong while verifying your email.";
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {success ? (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-semibold">Email Verified</h1>
                        <p className="text-muted-foreground mt-2">{message}</p>
                    </>
                ) : (
                    <>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-semibold">
                            Verification Failed
                        </h1>
                        <p className="text-muted-foreground mt-2">{message}</p>
                        <Link href="/login">
                            <Button variant="link" className="text-blue-500">Go to Login</Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;