import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";

const checkTokens = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  access_token: string,
  refresh_token: string
) => {
  if (!context.req.cookies[refresh_token]) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else if (!context.req.cookies[access_token]) {
    await axios
      .get(`${process.env.BACK_API_PATH}/auth/refresh`, {
        withCredentials: true,
        headers: {
          Cookie: `Refresh=${context.req.cookies[refresh_token]}`,
        },
      })
      .then((res) => {
        context.res.setHeader("set-Cookie", res.headers["set-cookie"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return {
    redirect: null,
  };
};

export default checkTokens;
