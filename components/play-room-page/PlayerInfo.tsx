import { VFC } from 'react';
import useSWR from 'swr';
import { IGameResultWinRate } from '@/typings/db';
import fetcher from '@/utils/fetcher';
// import { IUser } from '@/typings/db';

interface IProps {
  player1: string;
  player2: string;
  id1P: number | undefined;
  id2P: number | undefined;
}

const PlayerInfo: VFC<IProps> = ({
  player1, player2,
  id1P, id2P,
}) => {
  const { data: info1p } = useSWR<IGameResultWinRate | null>(id1P ? `/api/game/${id1P}/win_rate` : null,
    fetcher);
  const { data: info2p } = useSWR<IGameResultWinRate | null>(id2P ? `/api/game/${id2P}/win_rate` : null,
    fetcher);
  return (
    <div className="w-full h-full">
      {/* player name */}
      <div className="flex h-1/6 justify-center content-center">
        <div className="border border-gray-900 w-1/2 h-full text-center">
          {player1}
        </div>
        <div className="border border-gray-900 w-1/2 h-full text-center">
          {player2}
        </div>
      </div>
      {/* player info */}
      <div className="flex h-5/6 items-center justify-center">
        <div className="flex flex-col border border-gray-900 w-1/2 h-full text-center justify-center content-center">
          {info1p && (
            <>
              <div>{`승률 ${info1p?.winRate} %`}</div>
              <div>{`${info1p?.winCount} 승 ${info1p?.loseCount} 패`}</div>
            </>
          )}
        </div>
        <div className="flex flex-col border border-gray-900 w-1/2 h-full text-center justify-center content-center">
          {info2p && (
            <>
              <div>{`승률 ${info2p?.winRate} %`}</div>
              <div>{`${info2p?.winCount} 승 ${info2p?.loseCount} 패`}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
