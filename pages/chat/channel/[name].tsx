import { useRouter } from 'next/router';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import useSWR from 'swr';
import axios from 'axios';
import ChatBox from '@/components/chat-page/ChatBox';
import ChatLayout from '@/layouts/ChatLayout';
import useInput from '@/hooks/useInput';
import fetcher from '@/utils/fetcher';
import { IChannel, IChat, IUser } from '@/typings/db';
import ChatItem from '@/components/chat-page/ChatItem';
import useSocket from '@/hooks/useSocket';

const Channel = () => {
  const router = useRouter();
  const { name } = router.query;
  const [chat, onChangeChat, setChat] = useInput('');
  const [showEmoji, setShowEmoji] = useState(false);
  const { socket } = useSocket('chat');
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { data: channelData } = useSWR<IChannel>(
    `/api/channel/${name}`, fetcher,
  );
  const { data: chatDatas, mutate: mutateChat } = useSWR<IChat[]>(
    `/api/channel/${name}/chat`, fetcher,
  );

  const onCloseEmoji = useCallback(() => {
    setShowEmoji(false);
  }, []);

  const onSubmitChat = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatDatas && channelData && userData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.unshift({
            channelChatId: (chatDatas[0]?.channelChatId || 0) + 1,
            userId: userData.userId,
            channelId: channelData.channelId,
            content: savedChat,
            createdAt: new Date(),
            lastModifiedAt: new Date(),
            deletedAt: null,
          });
          return prevChatData;
        }, false).then(() => {
          // 읽지 않은 메시지 처리하기 추가
          setChat('');
        });
        axios.post(`/api/channel/${channelData.name}/chat`, {
          withCredentials: true,
          content: savedChat,
        }).catch(console.error);
      }
    },
    [channelData, chat, chatDatas, mutateChat, setChat, userData],
  );

  const onMessage = useCallback(
    (data: IChat) => {
      if (
        data.channelId === channelData?.channelId
        && (data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') || data.userId !== userData?.userId)
      ) {
        mutateChat((chatData) => {
          chatData?.unshift(data);
          return chatData;
        }, false);
      }
    },
    [channelData?.channelId, userData?.userId, mutateChat],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  useEffect(() => {
    console.log(`name change ${name}`);
    socket?.emit('', '');
  }, [name, socket]);

  return (
    <div className="h-full flex flex-col" role="button" tabIndex={0} onClick={onCloseEmoji} onKeyDown={onCloseEmoji}>
      <div className="h-full flex flex-col">
        <div className="font-semibold text-2xl pl-6">
          {`# ${channelData?.name}`}
        </div>
        <div className="flex-1">
          {
            chatDatas?.map((chatData) => (
              <ChatItem
                key={chatData.channelChatId}
                chatData={chatData}
              />
            ))
          }
        </div>
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
