import React, { ReactElement } from 'react';
import ChatLayout from '@/layouts/ChatLayout';

const Chat = () => <div className="font-bold">chat</div>;

Chat.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default Chat;
