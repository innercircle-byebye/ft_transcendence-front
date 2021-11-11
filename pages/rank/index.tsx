import { ReactElement } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';

import MainLayout from '@/layouts/MainLayout';
import PageContainer from '@/components/page-with-profilecard/PageContainer';
import ContentContainer from '@/components/page-with-profilecard/ContentContainer';
import ContentLeft from '@/components/page-with-profilecard/ContentLeft';
import ContentRight from '@/components/page-with-profilecard/ContentRight';
import RankBoard from '@/components/rank-page/RankBoard';
import ProfileCard from '@/components/rank-page/ProfileCard';

import type { IUser } from '@/typings/db';

const Rank = () => {
  const { data: me, error } = useSWR<IUser>('/api/profile/me', fetcher);

  return (
    <PageContainer maxWidth="xl">
      <ContentContainer>
        {/* 사용자 정보 */}
        <ContentLeft>
          {me && (
            <>
              <ProfileCard nickname={me.nickname} imagePath={me.imagePath} />
              <div className="flex justify-center">
                <Link href="/">
                  <a className="px-2 py-1 rounded-md text-lg bg-amber-300 text-gray-700">
                    내 Rank 보기
                  </a>
                </Link>
              </div>
            </>
          )}
          {error && <div>Something wrong.</div>}
        </ContentLeft>
        {/* 랭크 정보 */}
        <ContentRight>
          <div className="mb-4">
            <h1 className="text-4xl leading-10">Ranks</h1>
          </div>
          <RankBoard userId={me ? me.userId : null} />
        </ContentRight>
      </ContentContainer>
    </PageContainer>
  );
};

Rank.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Rank;
