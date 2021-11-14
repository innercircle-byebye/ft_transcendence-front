import { useCallback, VFC } from 'react';
import useSWR from 'swr';
import Scrollbars from 'react-custom-scrollbars-2';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IUser } from '@/typings/db';
import FriendItem from './FriendItem';
import fetcher from '@/utils/fetcher';

interface IProps {
  show: boolean;
}

const FriendList: VFC<IProps> = ({ show }) => {
  const { data: friendList, revalidate } = useSWR<IUser[]>('/api/friend/list', fetcher);

  const onClickDeleteFriend = useCallback((friendData: IUser) => {
    axios.delete(`/api/friend/${friendData.userId}`, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      toast.success(`${friendData.nickname}을 친구에서 삭제했습니다.`, { position: 'bottom-right', theme: 'colored' });
      revalidate();
    }).catch(() => {
      toast.error(`${friendData.nickname}의 친구 삭제가 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [revalidate]);

  if (!show) {
    return null;
  }

  return (
    <div className="space-y-3 h-48">
      <Scrollbars autoHeight>
        {friendList?.map((data) => (
          <div key={data.userId + data.nickname} className="py-1">
            <FriendItem friendData={data} listType="friendList" onClickDeleteFriend={onClickDeleteFriend} />
          </div>
        ))}
      </Scrollbars>
    </div>
  );
};

export default FriendList;
