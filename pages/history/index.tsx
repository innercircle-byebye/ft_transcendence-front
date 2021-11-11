import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React, { ReactElement } from 'react';
import { ToastContainer } from 'react-toastify';
import Navbar from '@/components/navigation-bar/Navbar';
import ProfileCard from '@/components/ProfileCard';
import HistoryContentContainer from '@/components/history-page/HistoryContentContainer';
import PageContainer from '@/components/rank-page/PageContainer';
import RankContentContainer from '@/components/rank-page/RankContentContainer';
import RankContentLeft from '@/components/rank-page/RankContentLeft';
import RankContentRight from '@/components/rank-page/RankContentRight';

const History = ({ userInitialData }
  : InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <PageContainer maxWidth="xl">
      <RankContentContainer>
        <RankContentLeft>
          <ProfileCard profileUserData={userInitialData} />
        </RankContentLeft>
        <RankContentRight>
          <HistoryContentContainer />
        </RankContentRight>
      </RankContentContainer>
      <ToastContainer />
    </PageContainer>
);

History.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      {page}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
  },
});

export default History;
