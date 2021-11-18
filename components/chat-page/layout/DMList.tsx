import {
  useCallback, useEffect, useState, VFC,
} from 'react';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import { IStatusPlayer, IUser } from '@/typings/db';
import CollapseButton from './CollapseButton';
import EachDM from '@/components/chat-page/dm/EachDM';
import useSocket from '@/hooks/useSocket';

const DMList: VFC = () => {
  const { data: dmMembersData } = useSWR<IUser[]>('/api/dm/users', fetcher);
  const [dmCollapse, setDMCollapse] = useState(false);
  const { data: blockMemberData } = useSWR<IUser[]>('/api/block/list', fetcher);
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

  return (
    <div className="border-2 border-sky-700 bg-sky-50 rounded-lg w-full h-auto p-3 space-y-3">
      <div className="text-gray-800 font-semibold text-xl flex items-center">
        <CollapseButton collapse={dmCollapse} setCollapse={setDMCollapse} />
        DMs
      </div>
      <div className="flex flex-col max-h-80 overflow-y-auto">
        {!dmCollapse
          && dmMembersData?.map((member) => {
            if (blockMemberData?.map(
              (blockMember) => blockMember.userId,
            ).includes(member.userId)) {
              return null;
            }
            const isOnline = onlineList.includes(member.userId);
            const isPlayer1 = player1List.includes(member.userId);
            const isPlayer2 = player2List.includes(member.userId);
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
              <EachDM key={member.userId + member.nickname} member={member} status={status} />
            );
          })}
      </div>
    </div>
  );
};

export default DMList;
