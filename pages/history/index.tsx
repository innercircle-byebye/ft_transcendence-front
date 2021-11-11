import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React, { ReactElement } from 'react';
import { ToastContainer } from 'react-toastify';
import Navbar from '@/components/navigation-bar/Navbar';
import ProfileCard from '@/components/page-with-profilecard/ProfileCard';
import PageContainer from '@/components/page-with-profilecard/PageContainer';
import ContentContainer from '@/components/page-with-profilecard/ContentContainer';
import ContentLeft from '@/components/page-with-profilecard/ContentLeft';
import ContentRight from '@/components/page-with-profilecard/ContentRight';
import HistorySelect from '@/components/history-page/HistorySelect';
import useInput from '@/hooks/useInput';
import HistoryList from '@/components/history-page/HistoryList';

const History = ({ userInitialData }
  : InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [nickname, onChangeNickname] = useInput('');

  return (
    <PageContainer maxWidth="xl">
      <ContentContainer>
        <ContentLeft>
          <ProfileCard profileUserData={userInitialData} />
        </ContentLeft>
        <ContentRight>
          <div className="mb-4">
            <h1 className="text-4xl leading-10">History</h1>
          </div>
          <div className="p-4 rounded-md bg-gray-300 space-y-5">
            <HistorySelect nickname={nickname} onChangeNickname={onChangeNickname} />
            <HistoryList />
          </div>
        </ContentRight>
      </ContentContainer>
      <ToastContainer />
    </PageContainer>
  );
};

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
