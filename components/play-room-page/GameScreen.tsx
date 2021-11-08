import { useEffect, useState, VFC } from 'react';
import { IGameScreenData, IGameUpdateData } from '@/typings/db';
import Canvas from '@/components/play-room-page/Canvas';

interface IProps {
  onClickReady1P: () => void;
  onClickReady2P: () => void;
  isReady1P: boolean;
  isReady2P: boolean;
  initData: IGameScreenData | null;
  updateData: IGameUpdateData[] | null;
}

const GameScreen: VFC<IProps> = ({
  onClickReady1P, onClickReady2P,
  isReady1P, isReady2P,
  initData, updateData,
}) => {
  // 향후 websocket 를 통해서 이름을 받아온다.
  // props 에서 바꾼 이유는 role 계속 변할 수 있거든, 실시간 반영을 위해서 websocket 사용
  const player1 = 'mykang';
  const player2 = 'kycho';
  // 향후 state or websocket 을 통해서 score 를 받아온다.
  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);

  useEffect(() => {
    if (updateData) {
      if (updateData[0]) {
        setScore1(updateData[0].score);
      }
      if (updateData[1]) {
        setScore2(updateData[1].score);
      }
    }
  }, [updateData]);

  return (
    <div className="absolute w-full h-full">
      {/* player info bar */}
      <div className="flex justify-evenly items-center bg-gray-600 text-white h-1/12">
        <div>
          {`${player1}`}
        </div>
        <div>
          {`${score1} : ${score2}`}
        </div>
        <div>
          {`${player2}`}
        </div>
      </div>
      <div id="gameScreen" className="w-full bg-gray-400 h-11/12 justify-between items-center">
        {/* game screen */}
        <Canvas updateData={updateData} />
        <button
          type="button"
          onClick={onClickReady1P}
          className={`w-1/5 h-1/5 rounded-full ${isReady1P && 'bg-amber-500'} ${!isReady1P && 'bg-gray-200'}`}
          disabled={initData?.role !== 'player1'}
        >
          ready!
        </button>
        <button
          type="button"
          onClick={onClickReady2P}
          className={`w-1/5 h-1/5 rounded-full ${isReady2P && 'bg-amber-500'} ${!isReady2P && 'bg-gray-200'}`}
          disabled={initData?.role !== 'player2'}
        >
          ready!
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
