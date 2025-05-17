export const getTokenFromStorage = (): ReturnType<typeof localStorage.getItem> => {
    return localStorage.getItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION);
};
