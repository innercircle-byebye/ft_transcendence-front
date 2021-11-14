import { useCallback, VFC } from 'react';
import { mutate } from 'swr';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IUser } from '@/typings/db';

interface IProps {
  blockedData: IUser;
}

const BlockedItem: VFC<IProps> = ({ blockedData }) => {
  const onClickCancelBlockUser = useCallback(() => {
    axios.delete(`/api/block/${blockedData.userId}`, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      toast.success(`${blockedData.nickname}님을 차단을 풀었습니다.`, { position: 'bottom-right', theme: 'colored' });
    }).catch(() => {
      toast.error(`${blockedData.nickname}님 차단풀기에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [blockedData.nickname, blockedData.userId]);

  return (
    <div className="bg-amber-50 text-md rounded-md px-5 py-2 grid grid-cols-6 justify-items-center">
      <span className="col-span-1 justify-self-start">
        {blockedData.nickname}
      </span>
      <span className="col-span-4" />
      <span className="col-span-1 bg-sky-300 justify-self-start">
        <button
          type="button"
          onClick={() => {
            onClickCancelBlockUser();
            mutate('/api/block/list');
          }}
        >
          차단 해제하기
        </button>
      </span>
    </div>
  );
};
export default BlockedItem;
