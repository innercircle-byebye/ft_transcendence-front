import axios, { AxiosRequestConfig } from "axios";

// axios.defaults.baseURL = "http://localhost:3000";
// axios.defaults.withCredentials = true;

const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((response) => response.data);

export default fetcher;
