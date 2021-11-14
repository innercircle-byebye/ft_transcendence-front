import React, {
  Dispatch, SetStateAction, useCallback, VFC,
} from 'react';
import useSWR from 'swr';
import Scrollbars from 'react-custom-scrollbars-2';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IUser } from '@/typings/db';
import FriendItem from './FriendItem';
import fetcher from '@/utils/fetcher';

interface IProps {
  show: boolean;
  setGameRoomId: Dispatch<SetStateAction<number | null>>;
  onClickParticipate: () => void;
}

const FriendWaitList: VFC<IProps> = ({ show, setGameRoomId, onClickParticipate }) => {
  const { data: friendWaitData, revalidate } = useSWR<IUser[]>('/api/friend/wait', fetcher);

  const onClickCancelReqFriend = useCallback((friendData: IUser) => {
    axios.delete(`/api/friend/${friendData.userId}/request_cancel`, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      toast.success(`${friendData.nickname}님께 보낸 친구요청을 취소했습니다.`, { position: 'bottom-right', theme: 'colored' });
      revalidate();
    }).catch(() => {
      toast.error(`${friendData.nickname}님께 보낸 친구요청취소하기에 실패했습니다..`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [revalidate]);

  if (!show) {
    return null;
  }

  return (
    <div className="space-y-3 h-48">
      <Scrollbars autoHeight>
        {friendWaitData?.map((data) => (
          <div key={data.userId + data.nickname} className="py-1">
            <FriendItem
              friendData={data}
              listType="friendWaitList"
              onClickCancelReqFriend={onClickCancelReqFriend}
              setGameRoomId={setGameRoomId}
              onClickParticipate={onClickParticipate}
            />
          </div>
        ))}
      </Scrollbars>
    </div>
  );
};

export default FriendWaitList;
