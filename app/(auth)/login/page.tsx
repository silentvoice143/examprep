"use client"
import { CustomInput } from "@/components/shared/custom-input";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
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
                    <form className="space-y-5">
                        <CustomInput
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email"
                            iconLeft={<Mail size={18} />}
                            className="[&>label]:text-gray-primary"

                        />

                        <CustomInput
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            iconLeft={<Lock size={18} />}
                            showPasswordToggle
                            className="[&>label]:text-gray-primary"
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