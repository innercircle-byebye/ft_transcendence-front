import { useRouter } from 'next/router';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import useSWR from 'swr';
import axios from 'axios';
import ChatLayout from '@/layouts/ChatLayout';
import useSocket from '@/hooks/useSocket';
import { IDMChat, IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';
import useInput from '@/hooks/useInput';
import ChatBox from '@/components/chat-page/ChatBox';
import ChatItem from '@/components/chat-page/ChatItem';

const DM = () => {
  const router = useRouter();
  const DMUserName = router.query.id;
  const [chat, onChangeChat, setChat] = useInput('');
  const [showEmoji, setShowEmoji] = useState(false);
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { socket } = useSocket('chat');
  const { data: chatDatas, mutate: mutateChat } = useSWR<IDMChat[]>(
    `/api/dm/${DMUserName}/chats`,
    fetcher,
  );
  const { data: allUserData } = useSWR<IUser[]>('/api/user/all', fetcher);

  const onCloseEmoji = useCallback(() => {
    setShowEmoji(false);
  }, []);

  const onSubmitChat = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatDatas && userData) {
        const savedChat = chat;
        axios
          .post(
            // `/api/dm/${userData?.userId}/chats`,
            `/api/dm/${DMUserName}/chats`,
            {
              content: savedChat,
            },
            {
              headers: {
                withCredentials: 'true',
              },
            },
          )
          .catch(console.error);
      }
    },
    [DMUserName, chat, chatDatas, userData],
  );

  const onMessage = useCallback(
    (data: IDMChat) => {
      if (data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') || data.sender.userId !== userData?.userId) {
        mutateChat((chatData) => {
          chatData?.push(data);
          return chatData;
        }, false);
      }
    },
    [userData?.userId, mutateChat],
  );

  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);

  return (
    <div
      className="h-full flex flex-col"
      role="button"
      tabIndex={0}
      onClick={onCloseEmoji}
      onKeyDown={onCloseEmoji}
    >
      <div className="h-full flex flex-col">
        <div className="font-semibold text-2xl pl-6">
          {/* {`# ${channelData?.name}`} */}
          {DMUserName}
        </div>
        <div className="flex-1">
          {
            chatDatas?.map((chatData) => (
              <ChatItem
                key={chatData.dmId}
                chatData={{
                  createdAt: chatData.createAt,
                  userId: chatData.sender.userId,
                  imagePath: chatData.sender.imagePath,
                  content: chatData.content,
                }}
              />
            ))
          }
          chatlist
        </div>
        <ChatBox
          chat={chat}
          onChangeChat={onChangeChat}
          setChat={setChat}
          onSubmitChat={onSubmitChat}
          showEmoji={showEmoji}
          setShowEmoji={setShowEmoji}
          mentionData={
            allUserData?.map((data) => ({
              userId: data.userId, nickname: data.nickname, imagePath: data.imagePath,
            }))
          }
        />
      </div>
    </div>
  );
};

DM.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default DM;
