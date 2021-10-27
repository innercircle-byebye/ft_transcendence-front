import { useRouter } from 'next/router';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import ChatBox from '@/components/chat-page/ChatBox';
import ChatLayout from '@/layouts/ChatLayout';
import useInput from '@/hooks/useInput';
import fetcher from '@/utils/fetcher';
import {
  IChannel, IChannelChat, IChannelMember, IUser,
} from '@/typings/db';
import ChatItem from '@/components/chat-page/ChatItem';
import useSocket from '@/hooks/useSocket';
import ChannelButtons from '@/components/chat-page/ChannelButtons';
import reissueToken from '@/utils/reissueTokens';

const Channel = ({
  userInitialData,
  channelInitialData,
  channelChatInitialData,
  channelMemberInitialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const channelName = router.query.name;
  const [chat, onChangeChat, setChat] = useInput('');
  const [showEmoji, setShowEmoji] = useState(false);
  const { socket } = useSocket('chat');
  const { data: userData } = useSWR<IUser>('/api/user/me', fetcher, {
    initialData: userInitialData,
  });
  const { data: channelData } = useSWR<IChannel>(
    `/api/channel/${channelName}`, fetcher, {
      initialData: channelInitialData,
    },
  );
  const { data: channelChatData, mutate: mutateChat } = useSWR<IChannelChat[]>(
    `/api/channel/${channelName}/chat`, fetcher, {
      initialData: channelChatInitialData,
    },
  );
  const { data: channelMemberData } = useSWR<IChannelMember[]>(
    `/api/channel/${channelName}/member`, fetcher, {
      initialData: channelMemberInitialData,
    },
  );

  const onCloseEmoji = useCallback(() => {
    setShowEmoji(false);
  }, []);

  const onSubmitChat = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && channelChatData && channelData && userData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.push({
            channelChatId: (channelChatData[channelChatData.length - 1]?.channelChatId || 0) + 1,
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
          content: savedChat,
        }, {
          headers: {
            withCredentials: 'true',
          },
        }).catch(console.error);
      }
    },
    [channelData, chat, channelChatData, mutateChat, setChat, userData],
  );

  const onMessage = useCallback(
    (data: IChannelChat) => {
      if (data.userId !== userData?.userId) {
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
            channelChatData?.map((chatData) => (
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
          mentionData={
            channelMemberData?.map((data) => ({
              userId: data.userId, nickname: data.user.nickname, imagePath: data.user.imagePath,
            }))
          }
        />
      </div>
    </div>
  );
};

Channel.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';
  const refresh_token = process.env.REFRESH_TOKEN || '';
  const channelName = context.query.name;

  if (
    !context.req.cookies[refresh_token]
    || !context.req.cookies[access_token]
  ) {
    return reissueToken(
      context,
      access_token,
      refresh_token,
      '/chat',
    );
  }

  const userInitialData: IUser = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/user/me`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  const channelInitialData: IChannel = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/channel/${channelName}`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  const channelChatInitialData: IChannelChat[] = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/channel/${channelName}/chat`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  const channelMemberInitialData: IChannelMember[] = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/channel/${channelName}/member`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  return {
    props: {
      userInitialData,
      channelInitialData,
      channelChatInitialData,
      channelMemberInitialData,
    },
  };
};

export default Channel;
