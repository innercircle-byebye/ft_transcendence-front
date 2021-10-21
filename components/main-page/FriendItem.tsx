import { VFC } from 'react';
// import { IUser } from '@/typings/db';

interface IProps {
  // item: IUser;
  nickname: string;
  status: string;
}

const FriendItem: VFC<IProps> = ({ nickname, status }) => {
  if (status === 'offline') return null;
  if (status === 'not_registed') return null;

  return (
    // justify-between 을 적용하여 양쪽으로 퍼지게
    <div className="py-1 px-4 bg-amber-200 rounded-md flex w-full justify-between">
      <div className="flex space-x-1">
        <div>{nickname}</div>
        <div>ICON</div>
      </div>
      <div className="space-x-2 text-white">
        <button type="button" className="bg-sky-700 py-1 px-1 text-sm">
          게임신청
        </button>
        <button type="button" className="bg-sky-700 py-1 px-1 text-sm">
          DM보내기
        </button>
      </div>
    </div>
  );
};

export default FriendItem;
