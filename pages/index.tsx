import React, { ReactElement } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { IUser } from '@/typings/db';
import MainLayout from '@/layouts/MainLayout';
import reissueToken from '@/utils/reissueTokens';
import ProfileCard from '@/components/main-page/ProfileCard';
import AnnouncementList from '@/components/main-page/AnnouncementList';
import OnlineFriendList from '@/components/main-page/OnlineFriendList';

const Home = ({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!userData) {
    return <div>로딩중...</div>;
  }

  return (
    <div>
      <Head>
        <title>Pong&Chat</title>
        <meta name="description" content="Play pong game and Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OnlineFriendList />
      <ProfileCard userData={userData} />
      <AnnouncementList />
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
