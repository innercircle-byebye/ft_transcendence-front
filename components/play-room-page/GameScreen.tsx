import { VFC } from 'react';
import { IGameScreenData, IGameUpdateData } from '@/typings/db';
import Canvas from '@/components/play-room-page/Canvas';

interface IProps {
  onClickReady1P: () => void;
  onClickReady2P: () => void;
  isReady1P: boolean;
  isReady2P: boolean;
  initData: IGameScreenData | null;
  updateData: IGameUpdateData[] | null;
  draw: (context: CanvasRenderingContext2D | null | undefined) => void;
}

const GameScreen: VFC<IProps> = ({
  onClickReady1P, onClickReady2P, isReady1P, isReady2P,
  initData, updateData,
  draw,
}) => {
  // 향후 props 를 통해서 이름을 받아온다.
  const player1 = 'mykang';
  const player2 = 'kycho';
  // 향후 state or websocket 을 통해서 score 를 받아온다.
  const score1 = 0;
  const score2 = 0;
  console.log('initData', initData);

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
      <div id="fuck" className="w-full bg-gray-400 h-11/12 justify-between items-center">
        {/* game screen */}
        <Canvas updateData={updateData} role={initData && initData.role} draw={draw} />
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
