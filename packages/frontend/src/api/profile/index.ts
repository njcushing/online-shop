import { Profile } from "@/utils/schemas/profile";
import * as HTTPMethodTypes from "../types";
import { getTokenFromStorage } from "../utils/getTokenFromStorage";
import { fetcher } from "../utils/fetcher";

export const getProfile: HTTPMethodTypes.GET<undefined, Profile> = async (data) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const result = await fetcher<Profile>(`${import.meta.env.VITE_SERVER_DOMAIN}/api/profile`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: { Authorization: token },
    });

    return result;
};
