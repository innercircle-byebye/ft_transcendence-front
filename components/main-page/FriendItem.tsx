import { VFC } from 'react';
import { RiPingPongFill } from 'react-icons/ri';

interface IProps {
  nickname: string;
  status: string
}

const FriendItem: VFC<IProps> = ({ nickname, status }) => (
  // justify-between 을 적용하여 양쪽으로 퍼지게
  <div className="py-1 px-4 bg-amber-50 rounded-md flex w-full justify-between">
    <div className="flex space-x-1 items-center">
      <div>{nickname}</div>
      {status === 'online' && <div className="w-2 h-2 rounded-full bg-green-600" />}
      {status === 'player1' && <RiPingPongFill className="text-blue-600" />}
      {status === 'player2' && <RiPingPongFill className="text-red-500" />}
    </div>
    <div className="space-x-2 text-white">
      {status === 'online' && (
      <button type="button" className="bg-sky-700 py-1 px-1 text-sm">
        게임신청
      </button>
      )}
      <button type="button" className="bg-sky-700 py-1 px-1 text-sm">
        DM보내기
      </button>
    </div>
  </div>
);

export default FriendItem;
