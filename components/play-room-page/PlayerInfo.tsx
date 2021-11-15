import { VFC } from 'react';
// import { IUser } from '@/typings/db';

interface IProps {
  player1: string;
  player2: string;
  // info1P: IUser;
  // info2P: IUser;
}

const PlayerInfo: VFC<IProps> = ({ player1, player2 }) => (
  <div className="w-full h-full">
    {/* player name */}
    <div className="flex h-1/6 justify-center">
      <div className="border border-gray-900 w-1/2 h-full text-center">
        {player1}
      </div>
      <div className="border border-gray-900 w-1/2 h-full text-center">
        {player2}
      </div>
    </div>
    {/* player info */}
    <div className="flex h-5/6 items-center justify-center">
      <div className="border border-gray-900 w-1/2 h-full text-center">
        주변에 코인으로 돈을 벌었다는 사람이 있는데
      </div>
      <div className="border border-gray-900 w-1/2 h-full text-center">
        박세일은 코인으로 돈을 벌지 못했다.
      </div>
    </div>
  </div>
);

export default PlayerInfo;
