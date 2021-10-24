import { ReactElement } from 'react';
import Link from 'next/link';
import MainLayout from '@/layouts/MainLayout';
import PageContainer from '@/components/rank-page/PageContainer';
import RankContentContainer from '@/components/rank-page/RankContentContainer';
import RankContentLeft from '@/components/rank-page/RankContentLeft';
import RankContentRight from '@/components/rank-page/RankContentRight';
import RankBoard from '@/components/rank-page/RankBoard';
import ProfileCard from '@/components/rank-page/ProfileCard';

const dummyUserProfile = {
  imagePath: 'https://picsum.photos/400/400',
  nickname: 'Fox',
};

const Rank = () => (
  <PageContainer maxWidth="xl">
    <RankContentContainer>
      {/* 사용자 정보 */}
      <RankContentLeft>
        <ProfileCard
          nickname={dummyUserProfile.nickname}
          imagePath={dummyUserProfile.imagePath}
        />
        <div className="flex justify-center">
          <Link href="/">
            <a className="px-2 py-1 rounded-md text-lg bg-amber-300 text-gray-700">
              내 Rank 보기
            </a>
          </Link>
        </div>
      </RankContentLeft>
      {/* 랭크 정보 */}
      <RankContentRight>
        <div className="mb-4">
          <h1 className="text-4xl leading-10">Ranks</h1>
        </div>
        <RankBoard />
      </RankContentRight>
    </RankContentContainer>
  </PageContainer>
);

Rank.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Rank;
