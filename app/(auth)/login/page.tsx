"use client"
import { CustomInput } from "@/components/shared/custom-input";
import { Button } from "@/components/ui/button";
import { authApi } from "@/libs/api/api-services/auth.api";
import { handleApiError } from "@/libs/utils/error-handler";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const LoginPage = () => {
    const route = useRouter()
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await authApi.login(form)
            if (response.success) {
                route.push("/dashboard")
            }
        } catch (err) {
            handleApiError(err)
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4">
            <div className="w-full max-w-md">
                <div className="rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
                    {/* Logo / Heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white-primary">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-gray-primary">
                            Sign in to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <CustomInput
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email"
                            iconLeft={<Mail size={18} />}
                            className="[&>label]:text-gray-primary"
                            value={form.email}
                            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                        />

                        <CustomInput
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            iconLeft={<Lock size={18} />}
                            showPasswordToggle
                            className="[&>label]:text-gray-primary"
                            value={form.password}
                            onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                        />


                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-primary">
                                <input
                                    type="checkbox"
                                    className="accent-brand-primary"

                                />
                                Remember me
                            </label>

                            <button
                                type="button"
                                className="text-brand-light hover:text-white transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12! rounded-xl  py-3 font-semibold text-white transition-all bg-brand-primary hover:bg-brand-primary/80 hover:shadow-lg hover:shadow-brand-primary/30"
                            variant={"secondary"}
                        >
                            Sign In
                        </Button>
                    </form>
                    <div className="flex justify-center mt-4 gap-2">
                        <span className="text-gray-primary">Don't have an account? </span>
                        <Link href="/signup" className=" font-semibold text-brand-light hover:text-white transition-colors">
                            Sign Up
                        </Link>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default LoginPage;