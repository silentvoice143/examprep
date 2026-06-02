export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    requiresVerification?: boolean;
}