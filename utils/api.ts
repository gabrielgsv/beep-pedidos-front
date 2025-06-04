import axios from "axios";

export default () => {
  const config = useRuntimeConfig();
  if (useCookie("userToken").value?.length === 0) {
    navigateTo("/dashboard/login");
  }

  const api = axios.create({
    baseURL: config.public.apiUrl,
    headers: {
      Authorization: "Bearer " + useCookie("userToken").value,
      "X-Custom-Header": "foobar",
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        navigateTo("/dashboard/login");
        useCookie("userToken").value = null;
        useCookie("userId").value = null;
      }
      return error;
    }
  );

  return api;
};
