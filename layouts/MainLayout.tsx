import React, { FC } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import Navbar from '@/components/navigation-bar/Navbar';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

const MainLayout: FC = ({ children }) => {
  /*
  const [userData, setUserData] = useState<IUser>();
  useEffect(() => {
    axios
      .get('/api/user/me', {
        withCredentials: true,
      })
      .then((response) => setUserData(response.data));
  }, []);
  */
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  console.log('userData:', userData);

  if (!userData) {
    return (
      <>
        <Head>
          <title>Pong&Chat</title>
          <meta name="description" content="Play pong game and Chat" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar userNickName="aaa" />
        <main>{children}</main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Pong&Chat</title>
        <meta name="description" content="Play pong game and Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar userNickName={userData?.nickname} />
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
