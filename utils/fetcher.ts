import axios, { AxiosRequestConfig } from "axios";

const fetcher = (url: string, token: string) =>
  axios.get(url, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((response) => response.data);

export default fetcher;
