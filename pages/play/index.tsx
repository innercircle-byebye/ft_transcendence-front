import { GetServerSideProps } from 'next';
import React, { ReactElement, useCallback } from 'react';
import MainLayout from '@/layouts/MainLayout';
import ProfileCard from '@/components/play-page/ProfileCard';
import OnlineFriendList from '@/components/main-page/OnlineFriendList';
import RoomList from '@/components/play-page/RoomList';

const Play = () => {
  const onClickMakeRoom = useCallback(() => {
    console.log('방만들기');
  }, []);

  const onClickQuickStart = useCallback(() => {
    console.log('빠른시작');
  }, []);

  return (
    <div className="mx-auto h-screen max-w-screen-xl">
      <div className="grid grid-cols-3 py-8">
        <div className="flex flex-col items-center space-y-3">
          <ProfileCard />
          <div className="flex px-8 w-full justify-evenly">
            <button type="button" onClick={onClickMakeRoom} className="bg-green-400 text-3xl p-5 rounded-md">방만들기</button>
            <button type="button" onClick={onClickQuickStart} className="bg-red-500 text-3xl p-5 rounded-md">빠른시작</button>
          </div>
          <OnlineFriendList />
        </div>
        <div className="bg-sky-100 col-span-2">
          <RoomList />
        </div>
      </div>
    </div>
  );
};

Play.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
  },
});

export default Play;
