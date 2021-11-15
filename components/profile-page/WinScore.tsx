import { VFC } from 'react';
import useSWR from 'swr';
import { IGameResultWinRate } from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface IProps {
  userId: number;
}

const WinScore: VFC<IProps> = ({ userId }) => {
  const { data: winData } = useSWR<IGameResultWinRate>(
    `/api/game/${userId}/win_rate`, fetcher,
  );

  return (
    <div className="bg-gray-300 rounded-md p-5 space-y-2">
      <p className="text-3xl">
        Win Rate
      </p>
      <p className="text-center text-9xl font-bold">
        {`${winData?.winRate}%`}
      </p>
      <p className="text-center text-xl">
        {`${winData?.totalPlayCount}전 ${winData?.winCount} 승 ${winData?.loseCount}패`}
      </p>
    </div>
  );
};

export default WinScore;
