import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import ChatBox from '@/components/chat-page/ChatBox';
import ChatLayout from '@/layouts/ChatLayout';
import useInput from '@/hooks/useInput';
import fetcher from '@/utils/fetcher';
import { IChannel, IChat, IUser } from '@/typings/db';

const Channel = () => {
  const router = useRouter();
  const [chat, onChangeChat, setChat] = useInput('');
  const [showEmoji, setShowEmoji] = useState(false);
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { data: channelData } = useSWR<IChannel>(
    `http://localhost:3000/api/channels?name=${router.query.name}`,
    fetcher,
  );
  const { data: chatData, mutate: mutateChat } = useSWR<IChat[]>(
    'http://localhost:3000/api/chats', fetcher,
  );

  const onCloseEmoji = useCallback(() => {
    setShowEmoji(false);
  }, []);

  const onSubmitChat = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData && channelData && userData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.unshift({
            id: (chatData[0]?.id || 0) + 1,
            content: savedChat,
            UserId: userData.userId,
            User: userData,
            createdAt: new Date(),
            ChannelId: channelData.id,
            Channel: channelData,
          });
          return prevChatData;
        }, false).then(() => {
          // 읽지 않은 메시지 처리하기 추가
          setChat('');
        });
        axios.post(`/api/chat/channels/${channelData.name}/chats`, {
          content: savedChat,
        }).catch(console.error);
      }
    },
    [channelData, chat, chatData, mutateChat, setChat, userData],
  );

  return (
    <div className="h-full flex flex-col" role="button" tabIndex={0} onClick={onCloseEmoji} onKeyDown={onCloseEmoji}>
      <div className="h-full flex flex-col">
        <div className="font-semibold text-2xl pl-6">
          {`# ${channelData?.name}`}
        </div>
        <div className="flex-1">Chat Zone</div>
        <ChatBox
          chat={chat}
          onChangeChat={onChangeChat}
          setChat={setChat}
          onSubmitChat={onSubmitChat}
          showEmoji={showEmoji}
          setShowEmoji={setShowEmoji}
        />
      </div>
    </div>
  );
};

Channel.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default Channel;
