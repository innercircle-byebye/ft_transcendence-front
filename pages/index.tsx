import React, { ReactElement } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import MainLayout from '@/layouts/MainLayout';
import ProfileCard from '@/components/main-page/ProfileCard';
import AnnouncementList from '@/components/main-page/AnnouncementList';
import OnlineFriendList from '@/components/main-page/OnlineFriendList';

const Home = ({
  userInitialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <div>
    <OnlineFriendList />
    <ProfileCard userData={userInitialData} />
    <AnnouncementList />
  </div>
);

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
