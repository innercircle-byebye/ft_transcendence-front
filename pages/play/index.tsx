import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React, { ReactElement, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useInput from '@/hooks/useInput';
import ProfileCard from '@/components/play-page/ProfileCard';
import OnlineFriendList from '@/components/main-page/OnlineFriendList';
import PasswordModal from '@/components/chat-page/PasswordModal';
import RoomList from '@/components/play-page/RoomList';
import MainLayout from '@/layouts/MainLayout';
import { IUser } from '@/typings/db';

const Play = ({ userInitialData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [roomToEntrance, setRoomToEntrance] = useState<number | null>(null);
  const [password, onChangePassword, setPassword] = useInput('');

  const onClickMakeRoom = useCallback(() => {
    router.push('/play/create-room');
  }, [router]);

  const onClickQuickStart = useCallback(() => {
    console.log('빠른시작');
  }, []);

  const onSubmitPassword = useCallback(() => {
    console.log('비밀번호 입력');
    setPassword('');
  }, [setPassword]);

  const onClosePasswordModal = useCallback(() => {
    setRoomToEntrance(null);
    setPassword('');
  }, [setPassword]);

  return (
    <div className="mx-auto h-screen max-w-screen-xl">
      <div className="grid grid-cols-3 py-8">
        <div className="flex flex-col items-center space-y-3">
          <ProfileCard userInitialData={userInitialData} />
          <div className="flex px-8 w-full justify-evenly">
            <button type="button" onClick={onClickMakeRoom} className="bg-green-400 text-3xl p-5 rounded-md">방만들기</button>
            <button type="button" onClick={onClickQuickStart} className="bg-red-500 text-3xl p-5 rounded-md">빠른시작</button>
          </div>
          <OnlineFriendList />
        </div>
        <div className="bg-sky-100 col-span-2">
          {roomToEntrance && roomToEntrance % 2
            ? (
              <PasswordModal
                name={`${roomToEntrance}번방 입니다.`}
                password={password}
                onChangePassword={onChangePassword}
                onSubmitPassword={onSubmitPassword}
                onCloseModal={onClosePasswordModal}
              />
            )
            : (
              <RoomList
                roomToEntrance={roomToEntrance}
                setRoomToEntrance={setRoomToEntrance}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';

  const userInitialData: IUser = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/user/me`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  return {
    props: {
      userInitialData,
    },
  };
};

Play.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Play;
