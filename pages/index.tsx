import React, { ReactElement } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
// import MainLayout from '@/layouts/MainLayout';
import { ToastContainer } from 'react-toastify';
import ProfileCard from '@/components/main-page/ProfileCard';
import AnnouncementList from '@/components/main-page/AnnouncementList';
import OnlineFriendList from '@/components/main-page/OnlineFriendList';
import JoinedChannelList from '@/components/main-page/JoinedChannelList';
import Navbar from '@/components/navigation-bar/Navbar';
import PlayableCard from '@/components/main-page/PlayableCard';
import ObservableCard from '@/components/main-page/ObservableCard';

const Home = ({
  userInitialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!userInitialData) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="mx-auto h-screen max-w-screen-xl">
      <div className="grid grid-cols-3 py-8 gap-10">
        {/* 프로필카드와 공지사항 */}
        <div className="flex flex-col items-center space-y-3">
          <ProfileCard userData={userInitialData} />
          <AnnouncementList />
        </div>
        <div className="col-span-2 space-y-10">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-5">
              <PlayableCard />
            </div>
            <div className="col-span-7">
              <ObservableCard />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <OnlineFriendList />
            <JoinedChannelList />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      {page}
    </div>
  );
};

export default Home;
