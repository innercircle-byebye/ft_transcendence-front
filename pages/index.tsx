import React, { ReactElement } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ToastContainer } from 'react-toastify';
import AnnouncementList from '@/components/main-page/AnnouncementList';
import OnlineFriendList from '@/components/main-page/OnlineFriendList';
import JoinedChannelList from '@/components/main-page/JoinedChannelList';
import PageContainer from '@/components/page-with-profilecard/PageContainer';
import ContentLeft from '@/components/page-with-profilecard/ContentLeft';
import ContentRight from '@/components/page-with-profilecard/ContentRight';
import ContentContainer from '@/components/page-with-profilecard/ContentContainer';
import PlayableCard from '@/components/main-page/PlayableCard';
import ObservableCard from '@/components/main-page/ObservableCard';
import ProfileCard from '@/components/page-with-profilecard/ProfileCard';
import MainLayout from '@/layouts/MainLayout';
import RankItem from '@/components/profile-page/RankItem';

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
          <ProfileCard profileUserData={userInitialData} />
        </ContentLeft>
        <ContentRight>
          <div className="grid grid-rows-3">
            <div className="flex pb-5 space-x-5 w-full">
              <div className="flex w-5/12">
                <RankItem rankInfo={userInitialData.rankInfo} bgColor="bg-gray-200" />
              </div>
              <div className="flex w-7/12">
                <AnnouncementList />
              </div>
            </div>
            <div className="flex pb-5 space-x-5 w-full">
              <div className="flex w-5/12">
                <PlayableCard />
              </div>
              <div className="flex w-7/12">
                <ObservableCard />
              </div>
            </div>
            <div className="pb-5 grid grid-cols-2 space-x-5 w-full">
              <OnlineFriendList />
              <JoinedChannelList />
            </div>
          </div>
        </ContentRight>
      </ContentContainer>
      <ToastContainer />
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>{page}</MainLayout>
  );
};

export default Home;
