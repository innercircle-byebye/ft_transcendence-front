import { ReactElement } from 'react';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';

import MainLayout from '@/layouts/MainLayout';
import PageContainer from '@/components/page-with-profilecard/PageContainer';
import ContentContainer from '@/components/page-with-profilecard/ContentContainer';
import ContentLeft from '@/components/page-with-profilecard/ContentLeft';
import ContentRight from '@/components/page-with-profilecard/ContentRight';
import ProfileCard from '@/components/page-with-profilecard/ProfileCard';

import RankBoard from '@/components/rank-page/RankBoard';

import type { IUser } from '@/typings/db';

const Rank = ({ userInitialData }: { userInitialData: IUser }) => (
  <PageContainer maxWidth="xl">
    <ContentContainer>
      {/* 사용자 정보 */}
      <ContentLeft>
        {userInitialData && (
          <>
            <ProfileCard
              profileUserData={userInitialData}
            />
            <div className="flex justify-center mt-4">
              <Link href="/">
                <a className="px-2 py-1 rounded-md text-lg bg-amber-300 text-gray-700">
                  내 Rank 보기
                </a>
              </Link>
            </div>
          </>
        )}
      </ContentLeft>
      {/* 랭크 정보 */}
      <ContentRight>
        <div className="mb-4">
          <h1 className="text-4xl leading-10">Ranks</h1>
        </div>
        <RankBoard userId={userInitialData.userId} />
      </ContentRight>
    </ContentContainer>
  </PageContainer>
);

Rank.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

export default Rank;
