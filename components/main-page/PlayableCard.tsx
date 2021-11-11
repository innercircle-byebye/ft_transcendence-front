import useSWR from 'swr';
// import FriendItem from '@/components/main-page/FriendItem';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IGameResultWinRate, IGameRoom, IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';

const PlayableCard = () => {
  const router = useRouter();
  const { data: playableData, revalidate } = useSWR<IGameRoom>('/api/game/playable', fetcher);
  const [playerOneId, setPlayerOneId] = useState<number | null>(null);

  const { data: playerOne } = useSWR<IUser>(playerOneId ? `/api/user/${playerOneId}` : null, fetcher);
  const { data: playerOneWinRate } = useSWR<IGameResultWinRate>(playerOneId ? `/api/game/${playerOneId}/win_rate` : null, fetcher);

  const onClickRefresh = useCallback(() => {
    revalidate();
  }, [revalidate]);

  const onClickQuickPlay = useCallback(() => {
    console.log('게임하기');
    axios.post(`/api/game/room/${playableData?.gameRoomId}/join`, {
      role: 'player2',
    }, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      router.push(`/play/room/${playableData?.gameRoomId}`);
    }).catch(() => {
      toast.error('빠른시작 입장에 실패했습니다.', { position: 'bottom-right', theme: 'colored' });
    });
  }, [playableData?.gameRoomId, router]);

  useEffect(() => {
    if (playableData) {
      const playablePlayerOneId = playableData.gameMembers.find((v) => v.status === 'player1')?.userId;
      setPlayerOneId(playablePlayerOneId || null);
    }
  }, [playableData]);

  return (
    <div className="rounded-xl bg-red-500 text-center flex flex-grow flex-col space-y-2">
      <div className="flex flex-row mx-4 py-2 space-y-2 space-x-2">
        <div className="flex flex-col w-9/12">
          <div className="flex flex-row rounded-xl items-center bg-red-100 ">
            <div className="mx-6 text-lg">vs</div>
            <div className="flex flex-col mx-10 items-center">
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
          </div>
          <button type="button" onClick={onClickRefresh} className="self-center flex flex-grow space-y-2 text-lg">refresh</button>
        </div>
        <div className="flex flex-col w-3/12">
          <button type="button" onClick={onClickQuickPlay} className="rounded-xl bg-red-300 text-center flex flex-wrap space-y-2 text-4xl">빠른시작하기</button>
        </div>
      </div>
    </div>
  );
};

export default PlayableCard;
