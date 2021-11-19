import {
  useCallback, useEffect, useState, VFC,
} from 'react';
import useSWR from 'swr';
import FriendItem from '@/components/main-page/FriendItem';
import { IStatusPlayer, IUser } from '@/typings/db';
import useSocket from '@/hooks/useSocket';
import fetcher from '@/utils/fetcher';

const OnlineFriendList: VFC = () => {
  const { data: friendList } = useSWR<IUser[]>('/api/friend/list', fetcher);
  const { socket } = useSocket('main');
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const [player1List, setPlayer1List] = useState<number[]>([]);
  const [player2List, setPlayer2List] = useState<number[]>([]);

  const OnlineList = useCallback((data: number[]) => {
    setOnlineList(data);
  }, []);

  const OnPlayerList = useCallback((data: IStatusPlayer) => {
    setPlayer1List(data.player1);
    setPlayer2List(data.player2);
  }, []);

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

  return (
    <div className="rounded-xl bg-sky-700 text-center flex flex-grow flex-col space-y-2">
      <div className="text-white font-medium text-xl pt-3 pb-2">접속중인 친구목록</div>
      <div className="flex flex-col mx-4 py-2 space-y-2">
        {friendList?.map((friend: IUser) => {
          const isOnline = onlineList.includes(friend.userId);
          const isPlayer1 = player1List.includes(friend.userId);
          const isPlayer2 = player2List.includes(friend.userId);
          if (!isOnline && !isPlayer1 && !isPlayer2) {
            return null;
          }
          let status = 'online';
          if (isPlayer1) {
            status = 'player1';
          } else if (isPlayer2) {
            status = 'player2';
          }
          return (
            <FriendItem
              key={friend.userId + friend.nickname}
              nickname={friend.nickname}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OnlineFriendList;
