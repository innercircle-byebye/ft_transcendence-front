import { useRouter } from 'next/router';
import React, { ReactElement, useCallback } from 'react';
import useSWR from 'swr';
import ChatBox from '@/components/chat-page/ChatBox';
import ChatLayout from '@/layouts/ChatLayout';
import useInput from '@/hooks/useInput';
import fetcher from '@/utils/fetcher';
import { IChannel } from '@/typings/db';

const Channel = () => {
  const router = useRouter();
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: channelData } = useSWR<IChannel>(
    `http://localhost:3000/api/channels?id=${router.query.id}`,
    fetcher,
  );

  const onSubmitChat = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        // const savedChat = chat;
        // mutate 이후 post요청
      }
    },
    [chat],
  );

  return (
    <div className="h-full flex flex-col">
      <div className="font-semibold text-2xl pl-6">
        #
        {' '}
        {channelData?.name}
      </div>
      <div className="flex-1">Chat Zone</div>
      <ChatBox
        chat={chat}
        onChangeChat={onChangeChat}
        setChat={setChat}
        onSubmitChat={onSubmitChat}
      />
    </div>
  );
};

Channel.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default Channel;
