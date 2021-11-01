import '@/styles/globals.css';
import '@/styles/emoji.css';
import '@/styles/mention.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import {
  ReactElement, ReactNode, useEffect, useState,
} from 'react';
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import useSocket from '@/hooks/useSocket';
import reissueToken from '@/utils/reissueTokens';
import { IUser } from '@/typings/db';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();
  const { pathname } = router;
  const [namespace, setNamespace] = useState('');
  const { disconnect } = useSocket(namespace);

  useEffect(() => {
    if (pathname.slice(0, 5) === '/chat') {
      setNamespace('chat');
    } else {
      setNamespace('');
    }
  }, [pathname]);

  useEffect(() => () => {
    disconnect();
  }, [disconnect, namespace]);

  return getLayout(
    <Component {...pageProps} />,
  );
}

MyApp.getInitialProps = async (context: any) => {
  const { ctx, Component } = context;
  let pageProps = {};
  const access_token = process.env.ACCESS_TOKEN || '';
  const refresh_token = process.env.REFRESH_TOKEN || '';

  if (ctx.pathname === '/login') {
    return {};
  }
  if (
    !ctx.req.cookies[refresh_token]
    || !ctx.req.cookies[access_token]
  ) {
    return reissueToken(ctx, access_token, refresh_token);
  }
  if (Component.getInitialProps) {
    console.log('hellooooooo');
    pageProps = await Component.getInitialProps(ctx);
  }

  const userInitialData: IUser = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/user/me`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${ctx.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  if (ctx.pathname !== '/create-profile' && userInitialData.status === `${process.env.STATUS_NOT_REGISTER}`) {
    ctx.res.writeHead(302, {
      Location: '/create-profile',
    });
    ctx.res.end();
    return {};
  }

  // _app에서 props 추가 (모든 컴포넌트에서 공통적으로 사용할 값 추가)
  pageProps = { ...pageProps, userInitialData };

  return { pageProps };
};

export default MyApp;
