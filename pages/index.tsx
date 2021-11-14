import React, { ReactElement } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
// import MainLayout from '@/layouts/MainLayout';
import ProfileCard from '@/components/main-page/ProfileCard';
import AnnouncementList from '@/components/main-page/AnnouncementList';
import OnlineFriendList from '@/components/main-page/OnlineFriendList';
import JoinedChannelList from '@/components/main-page/JoinedChannelList';
import PageContainer from '@/components/page-with-profilecard/PageContainer';
import ContentLeft from '@/components/page-with-profilecard/ContentLeft';
import ContentRight from '@/components/page-with-profilecard/ContentRight';
import ContentContainer from '@/components/page-with-profilecard/ContentContainer';
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
    <PageContainer maxWidth="xl">
      <ContentContainer>
        <ContentLeft>
          <div className="space-y-10">
            <ProfileCard userData={userInitialData} />
            <AnnouncementList />
          </div>
        </ContentLeft>
        <ContentRight>
          <div className="flex pb-5 space-x-5 w-full">
            <div className="flex w-2/5">
              <PlayableCard />
            </div>
            <div className="flex w-3/5">
              <ObservableCard />
            </div>
          </div>
          <div className="flex space-x-5 w-full">
            <OnlineFriendList />
            <JoinedChannelList />
          </div>
        </ContentRight>
      </ContentContainer>
    </PageContainer>
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
