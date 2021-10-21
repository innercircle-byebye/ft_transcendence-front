import '@/styles/globals.css';
import '@/styles/emoji.css';
import '@/styles/mention.css';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import {
  ReactElement, ReactNode, useEffect, useState,
} from 'react';
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/router';
import useSocket from '@/hooks/useSocket';

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
  const [namespace, setNamespace] = useState<string | undefined>(undefined);
  const [socket, disconnect] = useSocket(namespace);

  useEffect(() => {
    if (pathname === '/chat') {
      setNamespace('chat');
    } else {
      setNamespace(undefined);
    }
  }, [namespace, pathname, socket]);

  useEffect(() => () => {
    disconnect();
    console.log(`disconnect ${namespace}`);
  }, [disconnect, namespace]);

  return getLayout(
    <Component {...pageProps} />,
  );
}

export default MyApp;
