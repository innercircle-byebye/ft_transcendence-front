import axios, { AxiosRequestConfig } from "axios";

const fetcher = (url: string) =>
  axios
    .get(url, {
      baseURL: process.env.API_PATH,
      withCredentials: true,
    })
    .then((response) => response.data);

export default fetcher;
