import {
  useCallback, useEffect, useState, VFC,
} from 'react';
import FriendItem from '@/components/main-page/FriendItem';
import { IUser } from '@/typings/db';
import useSocket from '@/hooks/useSocket';

interface IOnlineFriendData {
  userId: number;
  nickname: string;
  status: string;
}

interface IStatusPlayer {
  player1: number[];
  player2: number[];
}

interface IProps {
  friendData: IUser[];
}

const OnlineFriendList: VFC<IProps> = ({ friendData }) => {
  const { socket } = useSocket('main');
  const [onlineFriendList, setOnlineFriendList] = useState<IOnlineFriendData[]>([]);
  // const [onlinePlayerFriendList, setOnlinePlayerFriendList] = useState<IOnlineFriendData[]>([]);

  const OnlineList = useCallback(async (data: number[]) => {
    friendData.forEach((friend) => {
      console.log(data, friend.userId);
      if (data.includes(friend.userId)
      && !onlineFriendList.find((v) => v.userId === friend.userId)) {
        setOnlineFriendList([...onlineFriendList, {
          userId: friend.userId,
          nickname: friend.nickname,
          status: 'online',
        }]);
      }
    });
  }, [friendData, onlineFriendList]);

  const OnPlayerList = useCallback(async (data: IStatusPlayer) => {
    onlineFriendList.forEach((friend) => {
      if (data.player1.includes(friend.userId)) {
        setOnlineFriendList((prev) => {
          const newList = [...prev];
          const player1 = newList.find((v) => (v.userId === friend.userId));
          if (player1) player1.status = 'player1';
          return newList;
        });
      } else if (data.player2.includes(friend.userId)) {
        setOnlineFriendList((prev) => {
          const newList = [...prev];
          const player1 = newList.find((v) => (v.userId === friend.userId));
          if (player1) player1.status = 'player2';
          return newList;
        });
      } else {
        setOnlineFriendList((prev) => {
          const newList = [...prev];
          const player1 = newList.find((v) => (v.userId === friend.userId));
          if (player1) player1.status = 'online';
          return newList;
        });
      }
    });
  }, [onlineFriendList]);

  useEffect(() => {
    socket?.on('onlineList', OnlineList);
    return (() => {
      socket?.off('onlineList');
    });
  });

  useEffect(() => {
    socket?.on('playerList', OnPlayerList);
    return (() => {
      socket?.off('playerList');
    });
  });

  return (
    <div className="rounded-xl bg-sky-700 text-center flex flex-grow flex-col space-y-2">
      {/* title */}
      <div className="text-white font-medium text-xl pt-3 pb-2">접속중인 친구목록</div>
      {/* content list */}
      <div className="flex flex-col mx-4 py-2 space-y-2">
        {onlineFriendList.map((friend: IOnlineFriendData) => (
          <FriendItem
            key={friend.userId + friend.nickname}
            nickname={friend.nickname}
            status={friend.status}
          />
        ))}
      </div>
    </div>
  );
};

export default OnlineFriendList;
