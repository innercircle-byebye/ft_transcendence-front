import { useEffect, useState, VFC } from 'react';
import { IGameUpdateData } from '@/typings/db';
import Canvas from '@/components/play-room-page/Canvas';

interface IProps {
  onClickReady1P: () => void;
  onClickReady2P: () => void;
  isReady1P: boolean;
  isReady2P: boolean;
  // gameRoomData: IGameRoomData | undefined;
  name1p: string;
  name2p: string;
  role: string | undefined;
  updateData: IGameUpdateData[] | null;
  isPlaying: boolean;
}

const GameScreen: VFC<IProps> = ({
  onClickReady1P, onClickReady2P,
  isReady1P, isReady2P,
  name1p, name2p, role,
  updateData,
  isPlaying,
}) => {
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
          {`${name1p}`}
        </div>
        <div>
          {`${score1} : ${score2}`}
        </div>
        <div>
          {`${name2p}`}
        </div>
      </div>
      <div id="gameScreen" className="w-full bg-gray-400 h-11/12">
        {/* game screen */}
        {isPlaying
          ? (<Canvas updateData={updateData} />)
          : (
            <div className="w-full h-full flex justify-evenly items-center">
              <button
                type="button"
                onClick={onClickReady1P}
                className={`w-1/5 h-1/5 rounded-full ${isReady1P && 'bg-amber-500'} ${!isReady1P && 'bg-gray-200'}`}
                disabled={role !== 'player1'}
              >
                ready!
              </button>
              <button
                type="button"
                onClick={onClickReady2P}
                className={`w-1/5 h-1/5 rounded-full ${isReady2P && 'bg-amber-500'} ${!isReady2P && 'bg-gray-200'}`}
                disabled={role !== 'player2'}
              >
                ready!
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default GameScreen;
