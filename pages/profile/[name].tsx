import { useRouter } from 'next/router';
import useSWR from 'swr';
import React, { ReactElement } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ToastContainer } from 'react-toastify';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';
import ProfileCard from '@/components/page-with-profilecard/ProfileCard';
import RankItem from '@/components/profile-page/RankItem';
import WinScore from '@/components/profile-page/WinScore';
import HistoryList from '@/components/profile-page/HistoryList';
// import FriendListCard from '@/components/profile-page/FriendListCard';
import PageContainer from '@/components/page-with-profilecard/PageContainer';
import ContentContainer from '@/components/page-with-profilecard/ContentContainer';
import ContentLeft from '@/components/page-with-profilecard/ContentLeft';
import ContentRight from '@/components/page-with-profilecard/ContentRight';
import MainLayout from '@/layouts/MainLayout';
import FriendListCard from '@/components/profile-page/FriendListCard';

const Profile = ({ userInitialData }
  : InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { name } = router.query;
  const { nickname } = userInitialData;
  const { data: profileUserData } = useSWR<IUser>(
    name && nickname !== name ? `/api/user/nickname/${name}` : '/api/user/me', fetcher,
  );

  if (!profileUserData) {
    return <div>로딩중...</div>;
  }

  return (
    <PageContainer maxWidth="xl">
      <ContentContainer>
        <ContentLeft>
          <ProfileCard profileUserData={profileUserData} />
        </ContentLeft>
        <ContentRight>
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-10">
              <RankItem rankInfo={profileUserData.rankInfo} />
              <WinScore userId={profileUserData.userId} />
            </div>
            <FriendListCard show={profileUserData.nickname === nickname} />
            <HistoryList userId={profileUserData.userId} />
          </div>
        </ContentRight>
      </ContentContainer>
      <ToastContainer />
    </PageContainer>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
  },
});

export default Profile;
