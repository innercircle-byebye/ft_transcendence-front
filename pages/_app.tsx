import '@/styles/globals.css';
import '@/styles/emoji.css';
import '@/styles/mention.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import {
  ReactElement, ReactNode, useEffect,
} from 'react';
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import useSocket from '@/hooks/useSocket';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

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
  const { disconnect } = useSocket(typeof window !== 'undefined' ? window.localStorage.getItem('namespace') : null);
  const { socket: mainSocket } = useSocket('main');
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);

  useEffect(() => {
    if (userData?.userId) {
      mainSocket?.emit('login', userData?.userId);
    }
  }, [mainSocket, userData?.userId]);

  useEffect(() => {
    mainSocket?.on('dm', (data) => {
      console.log('dm 왔을때', data);
    });
    return () => {
      mainSocket?.off('dm', (data) => {
        console.log('dm 온거 확인 끝!', data);
      });
    };
  }, [mainSocket]);

  useEffect(() => {
    if (localStorage.getItem('namespace') !== 'chat' && pathname.slice(0, 5) === '/chat') {
      localStorage.setItem('namespace', 'chat');
    }
    if (localStorage.getItem('namespace') === 'chat' && pathname.slice(0, 5) !== '/chat') {
      disconnect();
      localStorage.removeItem('namespace');
    }
  }, [disconnect, pathname]);

  return getLayout(
    <Component {...pageProps} />,
  );
}

export default MyApp;
