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
  const [namespace, setNamespace] = useState('');
  const { disconnect } = useSocket(namespace);
  // const mainSocket = useSocket('main').socket;
  const { socket: mainSocket } = useSocket('main');
  const [isLogin, setIsLogin] = useState(false);
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  // 이 부분을 login 성공했을때로 변경
  // 'chatLogin' -> 'login'
  console.log('isLogin:', isLogin);
  if (isLogin === false) {
    if (userData?.userId) {
      mainSocket?.emit('login', userData?.userId);
      setIsLogin(true);
    }
  }

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

export default MyApp;
