import { useRouter } from 'next/router';
import {
  ReactElement, useCallback, useEffect, useRef, useState,
} from 'react';
import useSWR, { useSWRInfinite } from 'swr';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { toast, ToastContainer } from 'react-toastify';
import Scrollbars from 'react-custom-scrollbars-2';
import dayjs from 'dayjs';
import ChatLayout from '@/layouts/ChatLayout';
import useInput from '@/hooks/useInput';
import fetcher from '@/utils/fetcher';
import {
  IChannel, IChannelChat, IChannelMember, IUser,
} from '@/typings/db';
import useSocket from '@/hooks/useSocket';
import ChatBox from '@/components/chat-page/chat/ChatBox';
import ChannelButtons from '@/components/chat-page/channel/ChannelButtons';
import makeSection from '@/utils/makeSection';
import ChannelChatList from '@/components/chat-page/channel/ChannelChatList';

const Channel = ({
  userInitialData,
  channelInitialData,
  myChannelInitialData,
  channelMemberInitialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const channelName = router.query.name;
  const [chat, onChangeChat, setChat] = useInput('');
  const [showEmoji, setShowEmoji] = useState(false);
  const { socket } = useSocket('chat');
  const scrollbarRef = useRef<Scrollbars>(null);
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher, {
    initialData: userInitialData,
  });
  const { data: channelData } = useSWR<IChannel>(
    `/api/channel/${channelName}`, fetcher, {
      initialData: channelInitialData,
    },
  );
  const { revalidate } = useSWR<IChannel[]>(
    '/api/channel/me', fetcher, {
      initialData: myChannelInitialData,
    },
  );
  const { data: channelChatData, mutate: mutateChat, setSize } = useSWRInfinite<IChannelChat[]>(
    (index) => `/api/channel/${channelName}/chat?perPage=20&page=${index + 1}`, fetcher,
  );
  const { data: channelMemberData } = useSWR<IChannelMember[]>(
    `/api/channel/${channelName}/member`, fetcher, {
      initialData: channelMemberInitialData,
    },
  );
  const isEmpty = channelChatData?.length === 0;
  const isReachingEnd = isEmpty || false
    || (channelChatData && channelChatData[channelChatData.length - 1]?.length < 20) || false;
  const chatSections = makeSection(channelChatData ? channelChatData.flat().reverse() : []);

  const onCloseEmoji = useCallback(() => {
    setShowEmoji(false);
  }, []);

  const onSubmitChat = useCallback(
    (e) => {
      e.preventDefault();
      const myChannelMemberData = channelMemberData?.find((v) => v.userId === userData?.userId);
      if (myChannelMemberData?.mutedDate) {
        toast.error(`${dayjs(myChannelMemberData.mutedDate).format('YYYY-MM-DD h:mm A')}까지 채팅금지입니다.`, { position: 'bottom-right', theme: 'colored' });
        return;
      }
      if (chat?.trim() && channelChatData && channelData && userData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            channelChatId: (channelChatData[0][0]?.channelChatId || 0) + 1,
            userId: userData.userId,
            channelId: channelData.channelId,
            content: savedChat,
            createdAt: new Date(),
            lastModifiedAt: new Date(),
            deletedAt: null,
            user: {
              nickname: userData.nickname,
              imagePath: userData.imagePath,
            },
          });
          return prevChatData;
        }, false).then(() => {
          localStorage.setItem(`${channelName}`, new Date().getTime().toString());
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
        axios.post(`/api/channel/${channelData.name}/chat`, {
          content: savedChat,
        }, {
          headers: {
            withCredentials: 'true',
          },
        }).catch(console.error);
      }
    },
    [channelChatData, channelData, channelMemberData, channelName, chat,
      mutateChat, setChat, userData],
  );

  const onMessage = useCallback(
    (data: IChannelChat) => {
      if (data.content && data.userId !== userData?.userId) {
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

  const onUpdatedChannelName = useCallback((data: string) => {
    revalidate();
    router.push(`/chat/channel/${data}`);
    if (channelData?.ownerId !== userData?.userId) { toast.success('채널명이 변경되었습니다.', { position: 'bottom-right', theme: 'colored' }); }
  }, [channelData?.ownerId, revalidate, router, userData?.userId]);

  const onUpdateAdmin = useCallback((data: { isAdmin: boolean, userId: number, }) => {
    if (userData && data.userId === userData.userId) {
      if (data.isAdmin) {
        toast.info('관리자 권한이 생겼습니다.', { position: 'bottom-right', theme: 'colored' });
      } else {
        toast.info('관리자 권한이 없어졌습니다', { position: 'bottom-right', theme: 'colored' });
      }
    }
  }, [userData]);

  const onDeleteChannel = useCallback((deleteChannel: string) => {
    router.push('/chat');
    localStorage.removeItem(deleteChannel);
  }, [router]);

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  useEffect(() => {
    socket?.on('updatedChannelName', onUpdatedChannelName);
    return () => {
      socket?.off('updatedChannelName', onUpdatedChannelName);
    };
  }, [onUpdatedChannelName, socket]);

  useEffect(() => {
    socket?.on('updateChannelAdmin', onUpdateAdmin);
    return () => {
      socket?.off('updateChannelAdmin', onUpdateAdmin);
    };
  }, [onUpdateAdmin, socket]);

  useEffect(() => {
    socket?.on('deleteChannel', onDeleteChannel);
    return () => {
      socket?.off('deleteChannel', onDeleteChannel);
    };
  }, [onDeleteChannel, socket]);

  useEffect(() => {
    if (channelChatData?.length === 1) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom();
      }, 500);
    }
  }, [channelChatData]);

  useEffect(() => {
    localStorage.setItem(`${channelName}`, new Date().getTime().toString());
  }, [channelName]);

  return (
    <div className="relative h-full flex flex-col px-6" role="button" tabIndex={0} onClick={onCloseEmoji} onKeyDown={onCloseEmoji}>
      <div className="h-full flex flex-col">
        <div className="font-semibold text-2xl">
          {`# ${channelData?.name}`}
        </div>
        <ChannelChatList
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
            channelMemberData?.map((data) => ({
              userId: data.userId, nickname: data.user.nickname, imagePath: data.user.imagePath,
            }))
          }
        />
      </div>
      <ChannelButtons />
      <ToastContainer />
    </div>
  );
};

Channel.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';
  const channelName = context.query.name;

  const channelInitialData: IChannel = await axios
    .get(encodeURI(`http://back-nestjs:${process.env.BACK_PORT}/api/channel/${channelName}`), {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  const myChannelInitialData: IChannel[] = await axios
    .get(encodeURI(`http://back-nestjs:${process.env.BACK_PORT}/api/channel/me`), {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  const channelMemberInitialData: IChannelMember[] = await axios
    .get(encodeURI(`http://back-nestjs:${process.env.BACK_PORT}/api/channel/${channelName}/member`), {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  if (channelInitialData
      && (!myChannelInitialData?.map((v) => v.channelId).includes(channelInitialData?.channelId))) {
    return {
      redirect: {
        destination: '/chat',
        permanent: false,
      },
    };
  }

  return {
    props: {
      channelInitialData,
      myChannelInitialData,
      channelMemberInitialData,
    },
  };
};

export default Channel;
