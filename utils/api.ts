import axios from "axios";

export default () => {
  const config = useRuntimeConfig();

  return axios.create({
    baseURL: config.public.apiUrl,
    headers: {
      "X-Custom-Header": "foobar",
    },
  });
};
