import { useRouter } from 'next/router';
import {
  ReactElement, useCallback, useEffect, useRef, useState,
} from 'react';
import useSWR, { useSWRInfinite } from 'swr';
import axios from 'axios';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast, ToastContainer } from 'react-toastify';
import ChatLayout from '@/layouts/ChatLayout';
import useSocket from '@/hooks/useSocket';
import {
  IChannel, IDMChat, IGameRoom, IUser,
} from '@/typings/db';
import fetcher from '@/utils/fetcher';
import useInput from '@/hooks/useInput';
import ChatBox from '@/components/chat-page/chat/ChatBox';
import DMChatList from '@/components/chat-page/dm/DMChatList';
import makeSection from '@/utils/makeSection';
import DMButtons from '@/components/chat-page/dm/DMButtons';
import PasswordModal from '@/components/chat-page/PasswordModal';

const DM = () => {
  const router = useRouter();
  const DMUserName = router.query.name;
  const { data: dmUserData } = useSWR<IUser>(`/api/user/nickname/${DMUserName}`, fetcher);
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
  const [privateChannelToJoin, setPrivateChannelToJoin] = useState<IChannel | null>(null);
  const [privateGameToJoin, setPrivateGameToJoin] = useState<IGameRoom | null>(null);

  const [password, onChangePassword, setPassword] = useInput('');

  const onCloseEmoji = useCallback(() => {
    setShowEmoji(false);
  }, []);
  console.log(router.query);
  const onSubmitChat = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatDatas && userData && dmUserData && chatDatas) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            dmId: (chatDatas[0][0]?.dmId || 0) + 1,
            sender: userData,
            type: chatDatas[0][0]?.type,
            receiver: chatDatas[0][0]?.sender,
            content: savedChat,
            createdAt: chatDatas[0][0]?.createdAt,
            lastModifiedAt: chatDatas[0][0]?.lastModifiedAt,
          });
          return prevChatData;
        }, false).then(() => {
          localStorage.setItem(`dm-${DMUserName}`, new Date().getTime().toString());
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
    [DMUserName, chat, chatDatas, dmUserData, mutateChat, setChat, userData],
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
  const onSubmitPassword = useCallback((e) => {
    e.preventDefault();
    if (privateChannelToJoin) {
      axios.post(`/api/channel/${privateChannelToJoin.name}/member`, {
        password,
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(async () => {
        const channelName = privateChannelToJoin.name;
        setPrivateChannelToJoin(null);
        await router.push(`/chat/channel/${channelName}`);
      }).catch((error) => {
        setPassword('');
        console.dir(error);
        toast.error('틀린 비밀번호 입니다.', { position: 'bottom-right', theme: 'colored' });
      });
    }
    if (privateGameToJoin) {
      axios.post(`/api/game/room/${Number(privateGameToJoin?.gameRoomId)}/join`, {
        password,
        role: 'player2',
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(async () => {
        const { gameRoomId } = privateGameToJoin;
        setPrivateChannelToJoin(null);
        await router.push(`/play/room/${gameRoomId}`);
      }).catch((error) => {
        setPassword('');
        console.dir(error);
        toast.error('틀린 비밀번호 입니다.', { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [password, privateChannelToJoin, privateGameToJoin, router, setPassword]);

  const onClosePasswordModal = useCallback((e) => {
    e.preventDefault();
    setPrivateChannelToJoin(null);
  }, [setPrivateChannelToJoin]);

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
    localStorage.setItem(`dm-${DMUserName}`, new Date().getTime().toString());
  }, [DMUserName]);

  return (
    <div
      className="relative h-full flex flex-col"
      role="button"
      tabIndex={0}
      onClick={onCloseEmoji}
      onKeyDown={onCloseEmoji}
    >
      <div className="h-full flex flex-col">
        {privateChannelToJoin ? (
          <PasswordModal
            name={privateChannelToJoin.name}
            password={password}
            onChangePassword={onChangePassword}
            onSubmitPassword={onSubmitPassword}
            onCloseModal={onClosePasswordModal}
          />
        )
          : (
            <>
              <div className="font-semibold text-2xl pl-6">
                {/* {`# ${channelData?.name}`} */}
                {DMUserName}
              </div>
              <DMChatList
                chatSections={chatSections}
                ref={scrollbarRef}
                setSize={setSize}
                isReachingEnd={isReachingEnd}
                setPrivateChannelToJoin={setPrivateChannelToJoin}
                setPrivateGameToJoin={setPrivateGameToJoin}
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
            </>
          )}
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
