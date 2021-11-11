import React, { ReactElement, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Navbar from '@/components/navigation-bar/Navbar';
import ProfileCard from '@/components/page-with-profilecard/ProfileCard';
import PageContainer from '@/components/page-with-profilecard/PageContainer';
import ContentContainer from '@/components/page-with-profilecard/ContentContainer';
import ContentLeft from '@/components/page-with-profilecard/ContentLeft';
import ContentRight from '@/components/page-with-profilecard/ContentRight';
import HistorySelect from '@/components/history-page/HistorySelect';
import useInput from '@/hooks/useInput';
import HistoryList from '@/components/history-page/HistoryList';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';

const History = () => {
  const router = useRouter();
  const { name } = router.query;
  const { data: historyUserData } = useSWR<IUser>(name ? `/api/user/nickname/${name}` : null, fetcher);
  const [nickname, onChangeNickname] = useInput('');
  const [page] = useState(0);
  const [perPage] = useState(10);

  if (!historyUserData) {
    return <div>로딩중...</div>;
  }

  return (
    <PageContainer maxWidth="xl">
      <ContentContainer>
        <ContentLeft>
          <ProfileCard profileUserData={historyUserData} />
        </ContentLeft>
        <ContentRight>
          <div className="mb-4">
            <h1 className="text-4xl leading-10">History</h1>
          </div>
          <div className="p-4 rounded-md bg-gray-300 space-y-5">
            <HistorySelect nickname={nickname} onChangeNickname={onChangeNickname} />
            <HistoryList userId={historyUserData.userId} perPage={perPage} page={page} />
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

export default History;
