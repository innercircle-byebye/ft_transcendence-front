import { VFC } from 'react';

interface IProps {
  title: string;
  isLeft: boolean;
  onClickSwitch: () => void;
}

const Switch: VFC<IProps> = ({ title, isLeft, onClickSwitch }) => (
  <div className="flex items-center p-3 space-x-3">
    <span>{title}</span>
    <button type="button" className="relative" onClick={onClickSwitch}>
      <div className="block bg-gray-700 w-14 h-8 rounded-full" />
      {isLeft ? (
        <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" />
      ) : (
        <div className="absolute right-1 top-1 bg-red-400 w-6 h-6 rounded-full transition" />
      )}
    </button>
  </div>
);

export default Switch;
