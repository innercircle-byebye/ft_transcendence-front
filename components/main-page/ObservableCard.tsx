import useSWR from 'swr';
// import FriendItem from '@/components/main-page/FriendItem';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IGameResultWinRate, IGameRoom, IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

const ObservableCard = () => {
  const router = useRouter();
  const { data: observableData, revalidate } = useSWR<IGameRoom>('/api/game/observable', fetcher);
  const [playerOneId, setPlayerOneId] = useState<number | null>(null);
  const [playerTwoId, setPlayerTwoId] = useState<number | null>(null);

  const { data: playerOne } = useSWR<IUser>(playerOneId ? `/api/user/${playerOneId}` : null, fetcher);
  const { data: playerOneWinRate } = useSWR<IGameResultWinRate>(playerOneId ? `/api/game/${playerOneId}/win_rate` : null, fetcher);

  const { data: playerTwo } = useSWR<IUser>(playerTwoId ? `/api/user/${playerTwoId}` : null, fetcher);
  const { data: playerTwoWinRate } = useSWR<IGameResultWinRate>(playerTwoId ? `/api/game/${playerTwoId}/win_rate` : null, fetcher);

  const onClickRefresh = useCallback(() => {
    revalidate();
  }, [revalidate]);

  const onClickQuickObserve = useCallback(() => {
    console.log('관전하기');
    axios.post(`/api/game/room/${observableData?.gameRoomId}/join`, {
      role: 'observer',
    }, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      router.push(`/play/room/${observableData?.gameRoomId}`);
    }).catch(() => {
      toast.error('빠른관전 입장에 실패했습니다.', { position: 'bottom-right', theme: 'colored' });
    });
  }, [observableData?.gameRoomId, router]);

  useEffect(() => {
    if (observableData) {
      const playablePlayerOneId = observableData.gameMembers.find((v) => v.status === 'player1')?.userId;
      setPlayerOneId(playablePlayerOneId || null);

      const playablePlayerTwoId = observableData.gameMembers.find((v) => v.status === 'player2')?.userId;
      setPlayerTwoId(playablePlayerTwoId || null);
    }
  }, [observableData]);

  return (
    <div className="rounded-xl bg-yellow-500 p-5 w-full">
      {observableData && playerOne && playerTwo ? (
        <div className="flex flex-col items-center space-y-3">
          <div className="flex w-full space-x-3">
            <div className="flex justify-evenly rounded-xl items-center bg-yellow-100 w-5/6 px-2 py-5">
              <div className="flex flex-col mx-auto items-center">
                <div className="relative w-14 h-14 rounded-full">
                  <Image
                    src={playerOne.imagePath || '/image/rank/bronze.jpg'}
                    alt="previewImage"
                    objectFit="cover"
                    layout="fill"
                    className="rounded-full"
                  />
                </div>
                <span className="text-xl font-semibold">{playerOne?.nickname}</span>
                <span>{playerOne.rankInfo.title}</span>
                <span>{`승률 ${playerOneWinRate?.winRate}%`}</span>
              </div>
              <div className="text-xl">vs</div>
              <div className="flex flex-col mx-auto items-center">
                <div className="relative w-14 h-14 rounded-full">
                  <Image
                    src={playerTwo.imagePath || '/image/profile_default.png'}
                    alt="previewImage"
                    objectFit="cover"
                    layout="fill"
                    className="rounded-full"
                  />
                </div>
                <span className="text-xl font-semibold">{playerTwo?.nickname}</span>
                <span>{playerTwo.rankInfo.title}</span>
                <span>{`승률 ${playerTwoWinRate?.winRate}%`}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClickQuickObserve}
              className="rounded-xl bg-yellow-300 hover:bg-yellow-400 text-center space-y-2 text-3xl text-black text-opacity-80 w-1/6"
            >
              <div className="flex flex-wrap">빠른관전하기</div>
            </button>
          </div>
          <div className="flex flex-col w-1/6">
            <button type="button" onClick={onClickRefresh} className="self-center flex flex-grow space-x-1">
              <span>refresh</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full justify-center items-center text-white text-2xl">
          <span>빠른관전 가능한 방이 없습니다.</span>
        </div>
      )}
    </div>
  );
};

export default ObservableCard;
