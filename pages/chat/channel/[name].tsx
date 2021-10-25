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
import ChannelButtons from '@/components/chat-page/ChannelButtons';

const Channel = () => {
  const router = useRouter();
  const channelName = router.query.name;
  const [chat, onChangeChat, setChat] = useInput('');
  const [showEmoji, setShowEmoji] = useState(false);
  const { socket } = useSocket('chat');
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { data: channelData } = useSWR<IChannel>(
    `/api/channel/${channelName}`, fetcher,
  );
  const { data: chatDatas, mutate: mutateChat } = useSWR<IChat[]>(
    `/api/channel/${channelName}/chat`, fetcher,
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
          prevChatData?.push({
            channelChatId: (chatDatas[chatDatas.length - 1]?.channelChatId || 0) + 1,
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
      if (data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') || data.userId !== userData?.userId) {
        mutateChat((chatData) => {
          chatData?.push(data);
          return chatData;
        }, false);
      }
    },
    [userData?.userId, mutateChat],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  return (
    <div className="h-full flex flex-col px-6" role="button" tabIndex={0} onClick={onCloseEmoji} onKeyDown={onCloseEmoji}>
      <div className="h-full flex flex-col">
        <div className="flex flex-row justify-between items-end">
          <div className="font-semibold text-2xl">
            {`# ${channelData?.name}`}
          </div>
          <ChannelButtons />
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
