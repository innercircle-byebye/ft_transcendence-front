import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React, { ReactElement } from 'react';
import { ToastContainer } from 'react-toastify';
import Navbar from '@/components/navigation-bar/Navbar';
import ProfileCard from '@/components/page-with-profilecard/ProfileCard';
import HistoryContentContainer from '@/components/history-page/HistoryContentContainer';
import PageContainer from '@/components/page-with-profilecard/PageContainer';
import ContentContainer from '@/components/page-with-profilecard/ContentContainer';
import ContentLeft from '@/components/page-with-profilecard/ContentLeft';
import ContentRight from '@/components/page-with-profilecard/ContentRight';

const History = ({ userInitialData }
  : InferGetServerSidePropsType<typeof getServerSideProps>) => (
    <PageContainer maxWidth="xl">
      <ContentContainer>
        <ContentLeft>
          <ProfileCard profileUserData={userInitialData} />
        </ContentLeft>
        <ContentRight>
          <HistoryContentContainer />
        </ContentRight>
      </ContentContainer>
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
