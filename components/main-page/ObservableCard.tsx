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
    <div className="rounded-xl bg-yellow-500 text-center flex flex-grow flex-col space-y-2">
      <div className="flex flex-row mx-4 py-2 space-y-2 space-x-2">
        <div className="flex flex-col w-4/5">
          <div className="flex flex-row rounded-xl items-center bg-yellow-100 ">
            <div className="flex flex-col mx-auto items-center">
              <div className="relative bg-blue-300 w-10 h-10 rounded-full shadow-lg">
                <Image
                  src={playerOne?.imagePath ? playerOne.imagePath : '/image/rank/bronze.jpg'}
                  alt="previewImage"
                  objectFit="cover"
                  layout="fill"
                  className="rounded-full"
                />
              </div>
              <div className="w-auto flex-grow items-center">
                <a className="text-lg">{playerOne?.nickname}</a>
                <br />
                {playerOne?.rankInfo.title}
                <br />
                {`승률 ${playerOneWinRate?.winRate}%`}
              </div>
            </div>
            <div className="mx-6 text-lg">vs</div>
            <div className="flex flex-col mx-auto  items-center">
              <div className="relative bg-blue-300 w-10 h-10 rounded-full shadow-lg">
                <Image
                  src={playerTwo?.imagePath ? playerTwo.imagePath : '/image/profile_default.png'}
                  alt="previewImage"
                  objectFit="cover"
                  layout="fill"
                  className="rounded-full"
                />
              </div>
              <div className="w-auto flex-grow items-center">
                <a className="text-lg">{playerTwo?.nickname}</a>
                <br />
                {playerTwo?.rankInfo.title}
                <br />
                {`승률 ${playerTwoWinRate?.winRate}%`}
              </div>
            </div>
          </div>
          <button type="button" onClick={onClickRefresh} className="self-center flex flex-grow space-y-2 text-lg">
            refresh
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z" /></svg>
          </button>
        </div>
        <div className="flex flex-col w-1/5">
          <button
            type="button"
            onClick={onClickQuickObserve}
            className="rounded-xl bg-yellow-300 hover:bg-yellow-400 text-center flex flex-wrap space-y-2 text-4xl text-black text-opacity-80"
          >
            빠른관전하기

          </button>
        </div>
      </div>
    </div>
  );
};

export default ObservableCard;
