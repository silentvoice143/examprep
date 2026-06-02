import axios from "axios";
import { toast } from "sonner";

export const handleApiError = (
    error: unknown,
    fallbackMessage = "Something went wrong"
): string => {
    let message = fallbackMessage;

    if (axios.isAxiosError(error)) {
        message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            fallbackMessage;
    } else if (error instanceof Error) {
        message = error.message;
    }

    toast.error(message);

    return message;
};