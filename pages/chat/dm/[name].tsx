import { useRouter } from 'next/router';
import {
  ReactElement, useCallback, useEffect, useRef, useState,
} from 'react';
import useSWR, { useSWRInfinite } from 'swr';
import axios from 'axios';
import Scrollbars from 'react-custom-scrollbars-2';
import { ToastContainer } from 'react-toastify';
import ChatLayout from '@/layouts/ChatLayout';
import useSocket from '@/hooks/useSocket';
import { IDMChat, IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';
import useInput from '@/hooks/useInput';
import ChatBox from '@/components/chat-page/chat/ChatBox';
import DMChatList from '@/components/chat-page/dm/DMChatList';
import makeSection from '@/utils/makeSection';
import DMButtons from '@/components/chat-page/dm/DMButtons';

const DM = () => {
  const router = useRouter();
  const dMUserName = router.query.name;
  const { data: dmUserData } = useSWR<IUser>(`/api/user/nickname/${dMUserName}`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const [showEmoji, setShowEmoji] = useState(false);
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher);
  const { socket: mainSocket } = useSocket('main');
  const { data: chatDatas, mutate: mutateChat, setSize } = useSWRInfinite<IDMChat[]>(
    (index) => (dmUserData ? `/api/dm/${dmUserData.userId}/chats?perPage=20&page=${index + 1}` : null), fetcher,
  );
  const { data: allUserData } = useSWR<IUser[]>('/api/user/all', fetcher);
  const scrollbarRef = useRef<Scrollbars>(null);
  const isEmpty = chatDatas?.length === 0;
  const isReachingEnd = isEmpty || false
    || (chatDatas && chatDatas[chatDatas.length - 1]?.length < 20) || false;
  const chatSections = makeSection(chatDatas ? chatDatas.flat().reverse() : []);

  const onCloseEmoji = useCallback(() => {
    setShowEmoji(false);
  }, []);

  const onSubmitChat = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatDatas && userData && dmUserData && chatDatas) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            dmId: (chatDatas[0][0]?.dmId || 0) + 1,
            sender: userData,
            receiver: chatDatas[0][0]?.sender,
            content: savedChat,
            createdAt: chatDatas[0][0]?.createdAt,
            lastModifiedAt: chatDatas[0][0]?.lastModifiedAt,
          });
          return prevChatData;
        }, false).then(() => {
          localStorage.setItem(`dm-${dMUserName}`, new Date().getTime().toString());
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
        axios
          .post(
            `/api/dm/${dmUserData.userId}/chats`,
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
    [dMUserName, chat, chatDatas, dmUserData, mutateChat, setChat, userData],
  );

  const onMessage = useCallback(
    (data: IDMChat) => {
      if (data.content && data.sender.userId !== userData?.userId) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            if (scrollbarRef.current.getScrollHeight()
            < scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 50);
            }
          }
        });
      }
    },
    [userData?.userId, mutateChat],
  );

  useEffect(() => {
    mainSocket?.on('dm', onMessage);
    return () => {
      mainSocket?.off('dm', onMessage);
    };
  }, [mainSocket, onMessage]);

  useEffect(() => {
    if (chatDatas?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 500);
    }
  }, [chatDatas]);

  useEffect(() => {
    localStorage.setItem(`dm-${dMUserName}`, new Date().getTime().toString());
  }, [dMUserName]);

  return (
    <div
      className="relative h-full flex flex-col"
      role="button"
      tabIndex={0}
      onClick={onCloseEmoji}
      onKeyDown={onCloseEmoji}
    >
      <div className="h-full flex flex-col">
        <div className="font-semibold text-2xl pl-6">
          {/* {`# ${channelData?.name}`} */}
          {dMUserName}
        </div>
        <DMChatList
          chatSections={chatSections}
          ref={scrollbarRef}
          setSize={setSize}
          isReachingEnd={isReachingEnd}
        />
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
      <DMButtons />
      <ToastContainer />
    </div>
  );
};

DM.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default DM;
