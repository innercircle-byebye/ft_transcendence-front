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
import useSocket from '@/hooks/useSocket';
import reissueToken from '@/utils/reissueTokens';

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
  const { ctx } = context; // next에서 넣어주는 context
  const access_token = process.env.ACCESS_TOKEN || '';
  const refresh_token = process.env.REFRESH_TOKEN || '';

  if (
    ctx.pathname !== '/login' && (
      !ctx.req.cookies[refresh_token]
    || !ctx.req.cookies[access_token])
  ) {
    return reissueToken(ctx, access_token, refresh_token);
  }

  return {};
};

export default MyApp;
