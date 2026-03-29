import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});


// REQUEST INTERCEPTOR
// attaches access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// RESPONSE INTERCEPTOR
// handles token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    // if access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {

        const res = await axios.post(
          "http://127.0.0.1:8000/api/auth/token/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        // save new access token
        localStorage.setItem("access", newAccess);

        // update header
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        // retry original request
        return api(originalRequest);

      } catch (err) {

        // refresh token expired
        localStorage.clear();
        window.location.href = "/login";

      }
    }

    return Promise.reject(error);
  }
);

export default api;