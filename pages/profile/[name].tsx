import { useRouter } from 'next/router';
import useSWR from 'swr';
import React, { ReactElement } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ToastContainer } from 'react-toastify';
import fetcher from '@/utils/fetcher';
import { IUser } from '@/typings/db';
import Navbar from '@/components/navigation-bar/Navbar';
import ProfileCard from '@/components/ProfileCard';
import RankItem from '@/components/profile-page/RankItem';
import WinScore from '@/components/profile-page/WinScore';
import HistoryList from '@/components/profile-page/HistoryList';
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
    <div className="mx-auto h-screen max-w-screen-xl">
      <div className="grid grid-cols-3 py-8 gap-10">
        <div className="flex flex-col items-center space-y-3">
          <ProfileCard profileUserData={profileUserData} />
        </div>
        <div className="col-span-2 space-y-10">
          <div className="grid grid-cols-2 gap-10">
            <RankItem rankInfo={profileUserData.rankInfo} />
            <WinScore userId={profileUserData.userId} />
          </div>
          <div className="w-full">
            <FriendListCard />
          </div>
          <HistoryList />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
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

export default Profile;
