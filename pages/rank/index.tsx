import { useEffect, useRef } from 'react';
import { useSWRInfinite } from 'swr';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import type Scrollbars from 'react-custom-scrollbars-2';

import MainLayout from '@/layouts/MainLayout';
import PageContainer from '@/components/page-with-profilecard/PageContainer';
import ContentContainer from '@/components/page-with-profilecard/ContentContainer';
import ContentLeft from '@/components/page-with-profilecard/ContentLeft';
import ContentRight from '@/components/page-with-profilecard/ContentRight';
import ProfileCard from '@/components/page-with-profilecard/ProfileCard';
import fetcher from '@/utils/fetcher';

import type { IRank, IUser } from '@/typings/db';
import RankList from '@/components/rank-page/RankList';

const ITEM_COUNT_PER_PAGE = 13;

const Rank = ({ userInitialData }: { userInitialData: IUser }) => {
  const scrollbarRef = useRef<Scrollbars>(null);
  const { data: rankData, setSize } = useSWRInfinite<IRank[]>(
    (index) => `/api/game/ranking?perPage=${ITEM_COUNT_PER_PAGE}&page=${index + 1}`,
    fetcher,
  );

  const isReachingEnd = rankData ? rankData.length === 0
    || rankData[rankData.length - 1].length < ITEM_COUNT_PER_PAGE : false;

  useEffect(() => {
    if (rankData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToTop();
      }, 500);
    }
  }, [rankData]);

  if (!rankData) return <div>로딩중...</div>;

  return (
    <PageContainer maxWidth="xl">
      <ContentContainer>
        <ContentLeft>
          {userInitialData && (
            <>
              <ProfileCard profileUserData={userInitialData} />
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  className="px-2 py-1 rounded-md text-lg bg-amber-300 text-gray-700"
                >
                  내 Rank 보기
                </button>
              </div>
            </>
          )}
        </ContentLeft>
        <ContentRight>
          <div className="mb-4">
            <h1 className="text-4xl leading-10">Ranks</h1>
          </div>
          <div className="h-3/4">
            <RankList
              rankData={rankData ? rankData.flat() : []}
              setSize={setSize}
              isReachingEnd={isReachingEnd}
              ref={scrollbarRef}
            />
          </div>
        </ContentRight>
      </ContentContainer>
    </PageContainer>
  );
};

Rank.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

export default Rank;
