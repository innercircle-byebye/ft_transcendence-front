import {
  Dispatch, SetStateAction, useCallback, useEffect, useState, VFC,
} from 'react';
import useSWR from 'swr';
import Scrollbars from 'react-custom-scrollbars-2';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IStatusPlayer, IUser } from '@/typings/db';
import FriendItem from '@/components/profile-page/FriendItem';
import fetcher from '@/utils/fetcher';
import useSocket from '@/hooks/useSocket';

interface IProps {
  show: boolean;
  setGameRoomId: Dispatch<SetStateAction<number | null>>;
  onClickParticipate: () => void;
}

const FriendList: VFC<IProps> = ({ show, setGameRoomId, onClickParticipate }) => {
  const { data: friendList, revalidate } = useSWR<IUser[]>('/api/friend/list', fetcher);
  const { socket } = useSocket('main');
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const [player1List, setPlayer1List] = useState<number[]>([]);
  const [player2List, setPlayer2List] = useState<number[]>([]);

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

  const OnlineList = useCallback((data: number[]) => {
    setOnlineList(data);
  }, []);

  const OnPlayerList = useCallback((data: IStatusPlayer) => {
    setPlayer1List(data.player1);
    setPlayer2List(data.player2);
  }, []);

  useEffect(() => {
    socket?.emit('onlineList');
  }, [socket]);

  useEffect(() => {
    socket?.on('onlineList', OnlineList);
    return (() => {
      socket?.off('onlineList');
    });
  }, [OnlineList, socket]);

  useEffect(() => {
    socket?.on('playerList', OnPlayerList);
    return (() => {
      socket?.off('playerList');
    });
  }, [OnPlayerList, socket]);

  if (!show) {
    return null;
  }

  return (
    <div className="space-y-3 h-48">
      <Scrollbars autoHeight>
        {friendList?.map((friend) => {
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
                listType="friendList"
                onClickDeleteFriend={onClickDeleteFriend}
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

export default FriendList;
