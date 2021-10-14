import axios from "axios";

const fetcher = (url: string, access_token: string) =>
  axios
    .get(url, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${access_token}`,
      },
    })
    .then((response) => response.data);

export default fetcher;
