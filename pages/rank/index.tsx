import { ReactElement } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';

import MainLayout from '@/layouts/MainLayout';
import PageContainer from '@/components/rank-page/PageContainer';
import RankContentContainer from '@/components/rank-page/RankContentContainer';
import RankContentLeft from '@/components/rank-page/RankContentLeft';
import RankContentRight from '@/components/rank-page/RankContentRight';
import RankBoard from '@/components/rank-page/RankBoard';
import ProfileCard from '@/components/rank-page/ProfileCard';

import type { IUser } from '@/typings/db';

const Rank = () => {
  const { data: me } = useSWR<IUser>(
    '/api/profile/me',
    fetcher,
  );

  return (
    <PageContainer maxWidth="xl">
      <RankContentContainer>
        {/* 사용자 정보 */}
        <RankContentLeft>
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
        </RankContentLeft>
        {/* 랭크 정보 */}
        <RankContentRight>
          <div className="mb-4">
            <h1 className="text-4xl leading-10">Ranks</h1>
          </div>
          {me && <RankBoard userId={me.userId} />}
        </RankContentRight>
      </RankContentContainer>
    </PageContainer>
  );
};

Rank.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Rank;
