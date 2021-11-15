import { useCallback, useState, VFC } from 'react';

interface IProps {
  onClickExit: (e: any) => void;
}

const RoomButtonList: VFC<IProps> = ({ onClickExit }) => {
  const [Player, setPlayer] = useState('1p');

  const onClickOption = useCallback(
    () => {
      console.log('show Option Modal', Player);
    },
    [Player],
  );

  const onClickMove = useCallback(
    () => {
      if (Player === 'observer') {
        setPlayer('1p');
      } else {
        setPlayer('observer');
      }
    },
    [Player],
  );

  return (
    <div className="flex justify-evenly text-center h-full items-center">
      <button
        type="button"
        onClick={onClickOption}
        className={`w-1/5 rounded-md ${Player === '1p' ? 'bg-amber-500 text-white' : 'bg-gray-400 text-gray-600'}`}
      >
        옵션보기
      </button>
      <button
        type="button"
        onClick={onClickMove}
        className="w-1/5 rounded-md bg-blue-300 text-white"
      >
        {`${Player === 'observer' ? '참여하기' : '관전하기'}`}
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
};

export default RoomButtonList;
