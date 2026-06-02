import { api } from "../axios";
import {
    LoginPayload,
    SignupPayload,
    LoginResponse,
    ApiResponse,
} from "@/libs/types/auth"

export const authApi = {
    // Login
    login: async (
        payload: LoginPayload
    ): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>(
            "/auth/login",
            payload
        );

        return response.data;
    },

    // Signup
    signup: async (
        payload: SignupPayload
    ): Promise<ApiResponse> => {
        const response = await api.post<ApiResponse>(
            "/auth/signup",
            payload
        );

        return response.data;
    },

    // Verify Email
    verifyEmail: async (
        token: string
    ): Promise<ApiResponse> => {
        const response = await api.get<ApiResponse>(
            `/auth/verify-email?token=${token}`
        );

        return response.data;
    },
};