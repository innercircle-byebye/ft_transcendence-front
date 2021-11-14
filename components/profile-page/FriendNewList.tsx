import React, { useCallback, VFC } from 'react';
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

const FriendNewList: VFC<IProps> = ({ show }) => {
  const { data: friendNewData, revalidate: revalidateFriendNewData } = useSWR<IUser[]>('/api/friend/new', fetcher);
  const { revalidate: revalidateFriendList } = useSWR<IUser[]>('/api/friend/list', fetcher);

  const onClickAcceptFriend = useCallback((friendData: IUser) => {
    axios.patch(`/api/friend/${friendData.userId}/approve`, {}, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      toast.success(`${friendData.nickname}님에게 친구요청을 수락했습니다.`, { position: 'bottom-right', theme: 'colored' });
      revalidateFriendNewData();
      revalidateFriendList();
    }).catch(() => {
      toast.error(`${friendData.nickname}님에게 친구요청을 수락에 실패했습니다..`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [revalidateFriendList, revalidateFriendNewData]);

  if (!show) {
    return null;
  }

  return (
    <div className="space-y-3 h-48">
      <Scrollbars autoHeight>
        {friendNewData?.map((data) => (
          <div key={data.userId + data.nickname} className="py-1">
            <FriendItem friendData={data} listType="friendNewList" onClickAcceptFriend={onClickAcceptFriend} />
          </div>
        ))}
      </Scrollbars>
    </div>
  );
};

export default FriendNewList;
