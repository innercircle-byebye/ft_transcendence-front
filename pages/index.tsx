import React, { ReactElement } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import MainLayout from '@/layouts/MainLayout';
import ProfileCard from '@/components/main-page/ProfileCard';
import AnnouncementList from '@/components/main-page/AnnouncementList';
import OnlineFriendList from '@/components/main-page/OnlineFriendList';
import JoinedChannelList from '@/components/main-page/JoinedChannelList';

const Home = ({
  userInitialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!userInitialData) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="flex px-12 py-5 space-x-5">
      {/* 프로필카드와 공지사항 */}
      <div className="flex-none w-1/5 space-y-5">
        <ProfileCard userData={userInitialData} />
        <AnnouncementList />
      </div>
      {/* 빠른시작2개, 친구목록과 채널목록 */}
      <div className="flex space-x-5 w-4/5">
        <OnlineFriendList />
        <JoinedChannelList />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const access_token = process.env.ACCESS_TOKEN || '';
//   const refresh_token = process.env.REFRESH_TOKEN || '';

//   if (
//     !context.req.cookies[refresh_token]
//     || !context.req.cookies[access_token]
//   ) {
//     return reissueToken(context, access_token, refresh_token, '/');
//   }

//   const userData: IUser = await axios
//     .get(`http://back-nestjs:${process.env.BACK_PORT}/api/user/me`, {
//       withCredentials: true,
//       headers: {
//         Cookie: `Authentication=${context.req.cookies[access_token]}`,
//       },
//     })
//     .then((response) => response.data);

//   if (userData.status === process.env.STATUS_NOT_REGISTER) {
//     return {
//       redirect: {
//         destination: '/create-profile',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       userData,
//     },
//   };
// };

// ====================================================
//   userInitialData,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
//   <div>
//     <OnlineFriendList />
//     <ProfileCard userData={userInitialData} />
//     <AnnouncementList />
//   </div>
// );

// export const getServerSideProps: GetServerSideProps = async () => ({
//   props: {},
// });

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
