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
  const { socket } = useSocket('main');
  const { data: chatDatas, mutate: mutateChat } = useSWR<IDMChat[]>(
    `/api/dm/${DMUserName}/chats`,
    fetcher,
  );

  const onCloseEmoji = useCallback(() => {
    setShowEmoji(false);
  }, []);

  const onSubmitChat = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatDatas && userData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.unshift({
            dmId: (chatDatas[chatDatas.length - 1]?.dmId || 0) + 1,
            sender: userData,
            receiver: chatDatas[chatDatas.length - 1]?.sender,
            content: savedChat,
            createdAt: chatDatas[chatDatas.length - 1]?.createdAt,
            lastModifiedAt: chatDatas[chatDatas.length - 1]?.lastModifiedAt,
          });
          return prevChatData;
        }, false).then(() => {
          // 읽지 않은 메시지 처리하기 추가
          setChat('');
        });
        axios
          .post(
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
    [DMUserName, chat, chatDatas, mutateChat, setChat, userData],
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
            chatDatas?.slice(0).reverse().map((chatData) => (
              <ChatItem
                key={chatData.dmId}
                chatData={{
                  createdAt: chatData.createdAt,
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
        />
      </div>
    </div>
  );
};

DM.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default DM;
