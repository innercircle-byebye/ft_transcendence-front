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
  onlineList: number[];
  player1List: number[];
  player2List: number[];
}

const FriendNewList: VFC<IProps> = ({
  show, setGameRoomId, onClickParticipate, onlineList, player1List, player2List,
}) => {
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
        {friendNewData?.map((friend) => {
          const isOnline = onlineList.includes(friend.userId);
          const isPlayer1 = player1List.includes(friend.userId);
          const isPlayer2 = player2List.includes(friend.userId);
          let status;
          if (isPlayer1) {
            status = 'player1';
          } else if (isPlayer2) {
            status = 'player2';
          } else if (isOnline) {
            status = 'online';
          } else {
            status = 'offline';
          }
          return (
            <div key={friend.userId + friend.nickname} className="py-1">
              <FriendItem
                friendData={friend}
                listType="friendNewList"
                onClickAcceptFriend={onClickAcceptFriend}
                setGameRoomId={setGameRoomId}
                onClickParticipate={onClickParticipate}
                status={status}
              />
            </div>
          );
        })}
      </Scrollbars>
    </div>
  );
};

export default FriendNewList;
