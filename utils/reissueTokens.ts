import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

const reissueToken = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  access_token: string,
  refresh_token: string,
  current_url: string
) => {
  if (
    context.req.cookies[refresh_token] &&
    !context.req.cookies[access_token]
  ) {
    await axios
      .get(`http://back-nestjs:${process.env.BACK_PORT}/auth/refresh`, {
        withCredentials: true,
        headers: {
          Cookie: `Refresh=${context.req.cookies[refresh_token]}`,
        },
      })
      .then((res) => {
        context.res.setHeader('set-Cookie', res.headers['set-cookie']);
      })
      .catch((error) => {
        console.log(error);
      });
    return {
      redirect: {
        destination: current_url,
        permanent: false,
      },
    };
  }
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};

export default reissueToken;
