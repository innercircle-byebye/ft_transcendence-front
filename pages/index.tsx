import React, { ReactElement } from 'react';
import Head from 'next/head';
// import { useRouter } from 'next/router';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { IUser } from '@/typings/db';
import styles from '@/styles/Home.module.css';
import MainLayout from '@/layouts/MainLayout';
import reissueToken from '@/utils/reissueTokens';
import ProfileCard from '@/components/main-page/ProfileCard';
import AnnouncementList from '@/components/main-page/AnnouncementList';

const Home = ({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  /*
  const router = useRouter();

  const onClickLogout = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .get('/auth/logout')
        .then(() => {
          router.push('/login');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [router],
  );
  */

  if (!userData) {
    return <div>로딩중...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pong&Chat</title>
        <meta name="description" content="Play pong game and Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Welcome to Home Page!</h1>
      <h2>{userData?.nickname}</h2>
      <AnnouncementList />
      <ProfileCard userData={userData} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';
  const refresh_token = process.env.REFRESH_TOKEN || '';

  if (
    !context.req.cookies[refresh_token]
    || !context.req.cookies[access_token]
  ) {
    return reissueToken(context, access_token, refresh_token, '/');
  }

  const userData: IUser = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/user/me`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  if (userData.status === process.env.STATUS_NOT_REGISTER) {
    return {
      redirect: {
        destination: '/create-profile',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userData,
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
