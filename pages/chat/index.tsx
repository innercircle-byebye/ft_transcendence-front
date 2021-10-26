import React, {
  ReactElement, useCallback, useEffect,
} from 'react';
import useSWR from 'swr';
import ChatLayout from '@/layouts/ChatLayout';
import fetcher from '@/utils/fetcher';
import { IChannel } from '@/typings/db';
import useSocket from '@/hooks/useSocket';
import SearchChannel from '@/components/chat-page/SearchChannel';

const Chat = () => {
  const { socket } = useSocket('chat');
  const { data: channelData, mutate: mutateChannelData } = useSWR<IChannel[]>('/api/channel', fetcher);
  const { data: myChannelData } = useSWR<IChannel[]>('/api/channel/me', fetcher);

  const onChannelCreate = useCallback(
    (data: IChannel) => {
      if (!myChannelData?.includes(data)) {
        mutateChannelData((channel) => {
          channel?.push(data);
          return channel;
        }, false);
      }
    },
    [mutateChannelData, myChannelData],
  );

  useEffect(() => {
    socket?.on('channelList', onChannelCreate);
    return () => {
      socket?.off('channelList', onChannelCreate);
    };
  }, [socket, onChannelCreate]);

  if (!channelData || !myChannelData) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="h-full flex flex-col p-4 space-y-1">
      <SearchChannel channelData={channelData} />
    </div>
  );
};

Chat.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default Chat;
