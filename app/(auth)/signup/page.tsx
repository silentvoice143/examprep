"use client";

import { CustomInput } from "@/components/shared/custom-input";
import { Button } from "@/components/ui/button";
import { authApi } from "@/libs/api/api-services/auth.api";
import { useZodValidation } from "@/libs/hooks/useZod";
import { handleApiError } from "@/libs/utils/error-handler";
import { SignupFormData, signupSchema } from "@/libs/validation/auth.validation";
import { Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";


const SignupPage = () => {
    const router=useRouter()
    const [form, setForm] = useState<SignupFormData>({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
    })

    const { errors, validateField, validateForm } =
    useZodValidation({
      schema: signupSchema,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        validateField(name as keyof SignupFormData, value);
    };

    const handleSubmit = async (e: any) => {
        const isValid = validateForm(form)
        if(!isValid) return;
        e.preventDefault();
        try {
            const response = await authApi.signup(form)
            console.log(response)
            if(response?.success){
             toast.success("Account created successfully");
             setForm({
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                agreeToTerms: false
             });
             router.push("/login")
            }
        } catch (err) {
            handleApiError(err)
        }
    }

    console.log(errors,"--error")
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 py-10">
            <div className="w-full max-w-md">
                <div className="rounded-3xl bg-black/20 border border-white/10 p-8">
                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white-primary">
                            Create Account
                        </h1>
                        <p className="mt-2 text-gray-primary">
                            Join us and start your journey
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <CustomInput
                            name="name"
                            label="Full Name"
                            type="text"
                            placeholder="Enter your full name"
                            iconLeft={<User size={18} />}
                            className="[&>label]:text-gray-primary"
                            // inputContainerClassName="bg-black/30 text-white"
                            inputClassName="text-black "
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

                        <CustomInput
                            name="email"
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email"
                            iconLeft={<Mail size={18} />}
                            className="[&>label]:text-gray-primary"
                            // inputContainerClassName="bg-black/30 text-white"
                            inputClassName="text-black"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}

                        />

                        <CustomInput
                            name="phone"
                            label="Mobile Number"
                            type="tel"
                            placeholder="Enter your mobile number"
                            iconLeft={<Phone size={18} />}
                            className="[&>label]:text-gray-primary"
                            inputClassName="text-black"

                            value={form.phone}
                            onChange={handleChange}
                            error={errors.phone}
                        />

                        <CustomInput
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="Create a password"
                            iconLeft={<Lock size={18} />}
                            showPasswordToggle
                            className="[&>label]:text-gray-primary"
                            inputClassName="text-black"
                            value={form.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        <CustomInput
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            iconLeft={<Lock size={18} />}
                            showPasswordToggle
                            className="[&>label]:text-gray-primary"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                        />

                        <label className="flex items-start gap-3 text-sm text-gray-primary">
                            <input
                                name="agreeToTerms"
                                type="checkbox"
                                className="mt-1 accent-brand-primary"
                                checked={form.agreeToTerms}
                                onChange={handleChange}
                            />
                            <span>
                                I agree to the{" "}
                                <button
                                    type="button"
                                    className="text-brand-light hover:text-white"
                                >
                                    Terms of Service
                                </button>{" "}
                                and{" "}
                                <button
                                    type="button"
                                    className="text-brand-light hover:text-white"
                                >
                                    Privacy Policy
                                </button>
                            </span>
                        </label>

                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full h-12! rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/80 hover:shadow-lg hover:shadow-brand-primary/30"
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-gray-primary">
                        Already have an account?{" "}
                        <Link
                            href={"/login"}
                            className="font-semibold text-brand-light hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;