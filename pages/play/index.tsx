import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React, { ReactElement, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useInput from '@/hooks/useInput';
import ProfileCard from '@/components/ProfileCard';
import OnlineFriendList from '@/components/main-page/OnlineFriendList';
import PasswordModal from '@/components/chat-page/PasswordModal';
import RoomList from '@/components/play-page/RoomList';
import { IGameRoom } from '@/typings/db';
import Pagination from '@/components/play-page/Pagination';
import Navbar from '@/components/navigation-bar/Navbar';

const Play = ({ userInitialData, allRoomList }
  : InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [roomToEntrance, setRoomToEntrance] = useState<IGameRoom | null>(null);
  const [password, onChangePassword, setPassword] = useInput('');
  const [paginationRange] = useState(5);

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

  if (!allRoomList) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="mx-auto h-screen max-w-screen-xl">
      <div className="grid grid-cols-3 py-8">
        <div className="flex flex-col items-center space-y-3">
          <ProfileCard profileUserData={userInitialData} />
          <div className="flex px-8 w-full justify-evenly">
            <button type="button" onClick={onClickMakeRoom} className="bg-green-400 text-3xl p-5 rounded-md">방만들기</button>
            <button type="button" onClick={onClickQuickStart} className="bg-red-500 text-3xl p-5 rounded-md">빠른시작</button>
          </div>
          <OnlineFriendList />
        </div>
        <div className="bg-sky-100 col-span-2">
          {roomToEntrance && roomToEntrance.isPrivate
            ? (
              <PasswordModal
                name={`${roomToEntrance.title}`}
                password={password}
                onChangePassword={onChangePassword}
                onSubmitPassword={onSubmitPassword}
                onCloseModal={onClosePasswordModal}
              />
            )
            : (
              <>
                <RoomList
                  page={page}
                  roomToEntrance={roomToEntrance}
                  setRoomToEntrance={setRoomToEntrance}
                />
                <div className="flex justify-center">
                  <Pagination
                    page={page}
                    setPage={setPage}
                    totalPage={parseInt(`${allRoomList.length / paginationRange + 1}`, 10)}
                    paginationRange={paginationRange}
                  />
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';

  const allRoomList: IGameRoom[] = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/game/room/list`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  return {
    props: {
      allRoomList,
    },
  };
};

Play.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      {page}
    </div>
  );
};

export default Play;
