import { useStore } from "../store";

export const getAccessToken = () => {
    return useStore.getState().token;
};