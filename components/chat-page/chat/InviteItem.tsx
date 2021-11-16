import React, {
  Dispatch, FC, SetStateAction, useCallback,
} from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  IChannel, IChatItem, IGameRoom, IUser,
} from '@/typings/db';
import fetcher from '@/utils/fetcher';

interface Props {
  invitationData: IChatItem;
  setPrivateChannelToJoin: Dispatch<SetStateAction<IChannel | null>>;
  setPrivateGameToJoin: Dispatch<SetStateAction<IGameRoom | null>>;
}

const InviteItem: FC<Props> = ({
  invitationData,
  setPrivateChannelToJoin, setPrivateGameToJoin,
}) => {
  const router = useRouter();
  const { data: invitedChannelInfo } = useSWR<IChannel>(invitationData.type === 'channel_invite' ? `/api/channel/${invitationData.content}` : null, fetcher);
  const { data: invitedGameInfo } = useSWR<IGameRoom>(invitationData.type === 'game_invite' ? `/api/game/room/${invitationData.content}` : null, fetcher);
  const { data: myInfo } = useSWR<IUser>('/api/user/me');
  const onClickJoinGame = useCallback(() => {
    if (invitedGameInfo?.isPrivate) {
      setPrivateGameToJoin(invitedGameInfo);
    } else {
      // 비밀번호 처리 필요
      axios.post(`/api/game/room/${Number(invitationData?.content)}/join`, {
        role: 'player2',
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        router.push(`/play/room/${invitationData.content}`);
      }).catch(() => {
        toast.error(`${invitationData.nickname}이 보낸 게임방 초대에 입장할 수 없습니다.`, { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [invitationData.content, invitationData.nickname, invitedGameInfo,
    router, setPrivateGameToJoin]);

  const onClickJoinChannel = useCallback(() => {
    if (invitedChannelInfo?.isPrivate) {
      setPrivateChannelToJoin(invitedChannelInfo);
    } else {
      axios.post(`/api/channel/${invitationData?.content}/member`, {
      }, {
        headers: {
          withCredentials: 'true',
        },

      }).then(() => {
        router.push(`/chat/channel/${invitationData?.content}`);
      }).catch(() => {
        toast.error(`${invitationData.nickname}님이 보낸 게임방 초대에 입장할 수 없습니다.`, { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [invitationData?.content, invitationData.nickname, invitedChannelInfo,
    router, setPrivateChannelToJoin]);

  return (
    <div className="flex flex-row w-full">
      <div className="relative bg-blue-300 w-10 h-10 mr-2">
        <Image
          src={invitationData.imagePath}
          alt="previewImage"
          objectFit="cover"
          layout="fill"
          className="rounded-md"
        />
      </div>
      <div className="flex-1">
        <div className="space-x-2">
          <b>{invitationData.nickname}</b>
          <span className="text-sm text-gray-700">{dayjs(invitationData.createdAt).format('h:mm A')}</span>
        </div>
        <span className="w-full font-bold flex flex-row">
          {'님이 '}
          {invitationData.type === 'channel_invite' ? `채널 '${invitationData.content}' ` : '게임으'}
          로 초대합니다.
          {' '}
          {myInfo?.nickname !== invitationData.nickname ? (
            <>
              {invitationData.type === 'channel_invite'
                ? (

                  <button className="flex flex-row" type="button" onClick={onClickJoinChannel}>
                    [
                    {invitedChannelInfo?.isPrivate ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z" /></svg> : ''}
                    채널 입장하기]
                  </button>
                )
                : (
                  <button className="flex flex-row" type="button" onClick={onClickJoinGame}>
                    [
                    {invitedGameInfo?.isPrivate ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z" /></svg> : ''}
                    게임 입장하기]
                  </button>
                )}
            </>
          ) : null}
        </span>
      </div>
    </div>
  );
};
export default InviteItem;
