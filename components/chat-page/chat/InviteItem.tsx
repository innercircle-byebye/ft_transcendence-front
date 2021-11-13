import React, { FC, useCallback } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { IChatItem } from '@/typings/db';

interface Props {
  invitationData: IChatItem;
}

const InviteItem: FC<Props> = ({ invitationData }) => {
  const router = useRouter();
  const onClickJoinGame = useCallback(() => {
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
      console.log('error');
      toast.error(`${invitationData.nickname}이 보낸 게임방 초대에 입장할 수 없습니다.`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [invitationData.content, invitationData.nickname, router]);

  console.log(invitationData.content);
  const onClickJoinChannel = useCallback(() => {
    // 비밀번호 처리 필요
    axios.post(`/api/channel/${invitationData?.content}/member`, {
    }, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      router.push(`/chat/channel/${invitationData?.content}`);
    }).catch(() => {
      console.log('error');
      toast.error(`${invitationData.nickname}님이 보낸 게임방 초대에 입장할 수 없습니다.`, { position: 'bottom-right', theme: 'colored' });
    });
  }, [invitationData.content, invitationData.nickname, router]);

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
        <span className="w-full font-bold">
          {'님이 '}
          {invitationData.type === 'channel_invite' ? `채널 '${invitationData.content}' ` : '게임으'}
          로 초대합니다.
          {' '}
          {invitationData.type === 'channel_invite'
            ? (
              <button type="button" onClick={onClickJoinChannel}>
                [채널 입장하기]
              </button>
            )
            : (
              <button type="button" onClick={onClickJoinGame}>
                [게임 입장하기]
              </button>
            )}

        </span>
      </div>
    </div>
  );
};
export default InviteItem;