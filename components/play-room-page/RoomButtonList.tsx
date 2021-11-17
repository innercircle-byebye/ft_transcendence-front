import { VFC } from 'react';

interface IProps {
  myRole: string;
  isPlaying: boolean;
  onClickExit: (e: any) => void;
  onClickMove: () => void;
  onClickOption: () => void;
}

const RoomButtonList: VFC<IProps> = ({
  myRole, isPlaying,
  onClickExit, onClickMove, onClickOption,
}) => (
  <div className="flex justify-evenly text-center h-full items-center">
    <button
      type="button"
      onClick={onClickOption}
      className={`w-1/5 rounded-md ${myRole === 'player1' ? 'bg-amber-500 text-white' : 'bg-gray-400 text-gray-600'}`}
    >
      {`${myRole === 'player1' ? '옵션설정' : '옵션보기'}`}
    </button>
    <button
      type="button"
      onClick={onClickMove}
      disabled={isPlaying}
      className={`w-1/5 rounded-md text-white ${isPlaying ? 'bg-gray-200' : 'bg-blue-300'}`}
      // className="w-1/5 rounded-md bg-blue-300 text-white"
    >
      {`${myRole === 'observer' ? '참여하기' : '관전하기'}`}
    </button>
    <button
      type="button"
      onClick={onClickExit}
      className="w-1/5 rounded-md bg-amber-500 text-white"
    >
      나가기
    </button>
  </div>
);

export default RoomButtonList;
