import axios from "axios";

export default () => {
  const config = useRuntimeConfig();

  return axios.create({
    baseURL: config.public.apiUrl,
    headers: {
      Authorization: "Bearer " + useCookie("userToken").value,
      "X-Custom-Header": "foobar",
    },
  });
};
