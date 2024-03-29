import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSocket from '@/hooks/useSocket';
import ChannelList from '@/components/chat-page/layout/ChannelList';
import DMList from '@/components/chat-page/layout/DMList';
import Navbar from '@/components/navigation-bar/Navbar';

const ChatLayout: FC = ({ children }) => {
  const router = useRouter();
  const channelName = router.pathname === '/chat/channel/[name]' ? router.query.name : null;
  const { socket } = useSocket('chat');

  useEffect(() => {
    if (channelName) {
      socket?.emit('joinChannel', channelName);
    }
    return () => {
      if (channelName) { socket?.emit('leaveChannel', channelName); }
    };
  }, [channelName, router.pathname, socket]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      <div className="bg-sky-100 flex flex-row p-4 space-x-4 h-auto flex-1">
        <div className="flex flex-col space-y-4 w-60">
          <ChannelList />
          <div className="flex-1">
            <DMList />
          </div>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default ChatLayout;
