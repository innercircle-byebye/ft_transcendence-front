import ChatBox from '@/components/chat-page/ChatBox';
import useInput from '@/hooks/useInput';
import ChatLayout from '@/layouts/ChatLayout';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback } from 'react';

const Channel = () => {
  const router = useRouter();
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitChat = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        const savedChat = chat;
        // mutate 이후 post요청
      }
    },
    [chat]
  );

  return (
    <>
      <div className="font-semibold text-2xl pl-6">
        # channel {router.query.id}
      </div>
      <ChatBox
        chat={chat}
        onChangeChat={onChangeChat}
        onSubmitChat={onSubmitChat}
      />
    </>
  );
};

Channel.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default Channel;
