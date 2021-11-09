import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React, { ReactElement, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import useInput from '@/hooks/useInput';
import ProfileCard from '@/components/page-with-profilecard/ProfileCard';
import OnlineFriendList from '@/components/main-page/OnlineFriendList';
import PasswordModal from '@/components/chat-page/PasswordModal';
import RoomList from '@/components/play-page/RoomList';
import { IGameRoom } from '@/typings/db';
import Pagination from '@/components/play-page/Pagination';
import Navbar from '@/components/navigation-bar/Navbar';
import fetcher from '@/utils/fetcher';
import PageContainer from '@/components/page-with-profilecard/PageContainer';
import ContentContainer from '@/components/page-with-profilecard/ContentContainer';
import ContentLeft from '@/components/page-with-profilecard/ContentLeft';
import ContentRight from '@/components/page-with-profilecard/ContentRight';

const Play = ({ userInitialData }
  : InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);
  const [paginationRange] = useState(5);
  const [roomToEntrance, setRoomToEntrance] = useState<IGameRoom | null>(null);
  const [password, onChangePassword, setPassword] = useInput('');
  const { data: roomCount } = useSWR<number>('/api/game/room/list/count', fetcher);

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

  if (!roomCount) {
    return <div>로딩중</div>;
  }

  return (
    <PageContainer maxWidth="xl">
      <ContentContainer>
        <ContentLeft>
          <div className="space-y-5">
            <ProfileCard profileUserData={userInitialData} />
            <div className="flex w-full justify-evenly">
              <button type="button" onClick={onClickMakeRoom} className="bg-green-400 text-3xl p-5 rounded-md">방만들기</button>
              <button type="button" onClick={onClickQuickStart} className="bg-red-500 text-3xl p-5 rounded-md">빠른시작</button>
            </div>
            <OnlineFriendList />
          </div>
        </ContentLeft>
        <ContentRight>
          <div className="relative bg-sky-100">
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
                    perPage={perPage}
                    roomToEntrance={roomToEntrance}
                    setRoomToEntrance={setRoomToEntrance}
                  />
                  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
                    <Pagination
                      page={page}
                      setPage={setPage}
                      totalPage={parseInt(`${roomCount / perPage + 1}`, 10)}
                      paginationRange={paginationRange}
                    />
                  </div>
                </>
              )}
          </div>
        </ContentRight>
      </ContentContainer>
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
  },
});

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
