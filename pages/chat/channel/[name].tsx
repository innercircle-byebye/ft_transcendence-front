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
  const [socket] = useSocket('/chat');
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { data: channelData } = useSWR<IChannel>(
    `/api/channel/${name}`, fetcher,
  );
  const { data: chatDatas, mutate: mutateChat } = useSWR<IChat[]>(
    `/api/${name}/chat`, fetcher,
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
            id: (chatDatas[0]?.id || 0) + 1,
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
        axios.post(`/api/${channelData.name}/chat`, {
          content: savedChat,
        }).catch(console.error);
      }
    },
    [channelData, chat, chatDatas, mutateChat, setChat, userData],
  );

  const onMessage = useCallback(
    (data: IChat) => {
      console.log(data.Channel.name);
      console.log(data);
      console.log(name);
      if (
        data.Channel.name === name
        && (data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') || data.UserId !== userData?.userId)
      ) {
        mutateChat((chatData) => {
          chatData?.unshift(data);
          return chatData;
        }, false);
      }
    },
    [name, userData?.userId, mutateChat],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  return (
    <div className="h-full flex flex-col" role="button" tabIndex={0} onClick={onCloseEmoji} onKeyDown={onCloseEmoji}>
      <div className="h-full flex flex-col">
        <div className="font-semibold text-2xl pl-6">
          {`# ${channelData?.name}`}
        </div>
        <div className="flex-1">
          { chatDatas?.map((chatData) => <ChatItem key={chatData.id} chatData={chatData} />) }
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
