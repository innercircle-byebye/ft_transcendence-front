import {
  ReactElement, useEffect, useRef, useState,
} from 'react';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import useSWR, { useSWRInfinite } from 'swr';
import Scrollbars from 'react-custom-scrollbars-2';
import ProfileCard from '@/components/page-with-profilecard/ProfileCard';
import PageContainer from '@/components/page-with-profilecard/PageContainer';
import ContentContainer from '@/components/page-with-profilecard/ContentContainer';
import ContentLeft from '@/components/page-with-profilecard/ContentLeft';
import ContentRight from '@/components/page-with-profilecard/ContentRight';
import HistorySelect from '@/components/history-page/HistorySelect';
import HistoryList from '@/components/history-page/HistoryList';
import fetcher from '@/utils/fetcher';
import { IUser, IGameResult } from '@/typings/db';
import MainLayout from '@/layouts/MainLayout';

const History = () => {
  const router = useRouter();
  const { name } = router.query;
  const scrollbarRef = useRef<Scrollbars>(null);
  const { data: historyUserData } = useSWR<IUser>(name ? `/api/user/nickname/${name}` : null, fetcher);
  const [selectQuery, setSelectQuery] = useState('');
  const { data: historyData, setSize } = useSWRInfinite<IGameResult[]>(
    (index) => (historyUserData ? `/api/game/${historyUserData.userId}/results?perPage=${13}&page=${index + 1}${selectQuery}` : null), fetcher,
  );
  const isEmpty = historyData?.length === 0;
  const isReachingEnd = isEmpty || false
    || (historyData && historyData[historyData.length - 1]?.length < 13) || false;

  useEffect(() => {
    if (historyData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToTop();
      }, 500);
    }
  }, [historyData]);

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
          <div className="flex flex-col h-full">
            <div className="mb-4 flex-initial">
              <h1 className="text-4xl leading-10">History</h1>
            </div>
            <div className="p-5 space-y-5 rounded-md bg-gray-200 flex-1 flex flex-col">
              <HistorySelect
                setSelectQuery={setSelectQuery}
                historyUserId={historyUserData.userId}
              />
              <HistoryList
                historyData={historyData ? historyData?.flat() : []}
                setSize={setSize}
                isReachingEnd={isReachingEnd}
                ref={scrollbarRef}
              />
            </div>
          </div>
        </ContentRight>
      </ContentContainer>
      <ToastContainer />
    </PageContainer>
  );
};

History.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default History;
