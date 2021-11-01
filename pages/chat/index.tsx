import React, {
  ReactElement,
} from 'react';
import ChatLayout from '@/layouts/ChatLayout';
import SearchChannel from '@/components/chat-page/SearchChannel';
import SearchDM from '@/components/chat-page/SearchDM';

const Chat = () => (
  <div className="h-full flex flex-col p-4 space-y-1">
    <SearchChannel />
    <SearchDM />
  </div>
);

Chat.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default Chat;
