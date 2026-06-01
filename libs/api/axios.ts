import axios from "axios";
import { toast } from "sonner";

const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

export const api = axios.create({
  baseURL: baseurl,
  headers: {
    "Content-Type": "application/json",
  },
});

let isLoggingOut = false;

// ======================
// Request Interceptor
// ======================
api.interceptors.request.use(
  (config) => {
    // const token = getAccessToken();

    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // ✅ LOG FULL URL
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log("🚀 API Request:", {
      baseURL: config.baseURL,
      url: config.url,
      fullUrl,
      method: config.method,
    });

    return config;
  },
  (error) => Promise.reject(error),
);

// ======================
// Response Interceptor
// ======================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Something went wrong";

    switch (status) {
      case 401:
        console.log("401 error");
        // if (!isLoggingOut) {
        //   console.log("401 error 1");

        //   const { logout } = useStore.getState();
        //   isLoggingOut = true;

        //   const currentPath = window.location.pathname;

        //   toast.error(message ?? "Session expired. Please login again.");

        //   logout();

        //   if (currentPath !== "/login") {
        //     if (currentPath === "/super-admin/login") {
        //       setTimeout(() => {
        //         window.location.href = "/super-admin/login";
        //       }, 1000);
        //     } else {
        //       setTimeout(() => {
        //         window.location.href = "/login";
        //       }, 1500);
        //     }
        //   }
        // }
        break;

      case 403:
        toast.error("You are not authorized to perform this action.");
        break;

      case 404:
        toast.error(message ?? "Resource not found.");
        break;

      case 400:
        toast.error(message ?? "Bad request. Please check your input.");
        break;

      case 500:
        toast.error("Server error. Please try again later.");
        break;

      default:
        // Network error or unknown
        if (!error.response) {
          toast.error("Network error. Check your internet.");
        } else {
          toast.error(message);
        }
        break;
    }

    return Promise.reject(error);
  },
);
