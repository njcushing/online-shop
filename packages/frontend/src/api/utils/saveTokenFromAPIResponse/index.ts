export const saveTokenFromAPIResponse = async (response: JSON) => {
    if (!response || typeof response !== "object") return;

    if (!("data" in response) || !response.data || typeof response.data !== "object") return;
    const { data } = response;

    if (!("token" in data) || !data.token || typeof data.token !== "string") return;
    const { token } = data;

    localStorage.setItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION, token);
};
