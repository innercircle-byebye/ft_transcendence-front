import { VFC } from 'react';

interface IProps {
  gameResult: string;
  onClickExitButton: () => void;
}

const GameResultModal:VFC<IProps> = ({
  gameResult,
  onClickExitButton,
}) => (
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-xl">
    <div className="flex flex-col items-center bg-amber-100 space-y-8 p-6 rounded-xl">
      <div className="text-3xl">{gameResult}</div>
      <div className="flex items-center">
        <button type="button" onClick={onClickExitButton} className="bg-gray-400 text-2xl px-10 py-2 rounded-full">
          close
        </button>
      </div>
    </div>
  </div>
);

export default GameResultModal;
