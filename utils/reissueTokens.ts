import axios from 'axios';

const reissueToken = async (
  context: any,
  access_token: string,
  refresh_token: string,
) => {
  if (
    context.req.cookies[refresh_token]
    && !context.req.cookies[access_token]
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
    context.res.writeHead(302, {
      Location: context.req.url,
    });
    context.res.end();
    return {};
  }
  context.res.writeHead(302, {
    Location: '/login',
  });
  context.res.end();
  return {};
};

export default reissueToken;
