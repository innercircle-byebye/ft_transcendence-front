import { VFC } from 'react';
import { IUser } from '@/typings/db';

interface IProps {
  blockedUser: IUser;
  onClickCancelBlockUser: (blockedUser: IUser) => void;
}

const BlockedItem: VFC<IProps> = ({ blockedUser, onClickCancelBlockUser }) => (
  <div className="bg-amber-50 text-md rounded-md px-5 py-2 grid grid-cols-6 justify-items-center">
    <span className="col-span-1 justify-self-start">
      {blockedUser.nickname}
    </span>
    <span className="col-span-4" />
    <span className="bg-sky-300 rounded-full px-2 py-1">
      <button type="button" onClick={() => onClickCancelBlockUser(blockedUser)}>
        차단해제하기
      </button>
    </span>
  </div>
);
export default BlockedItem;
