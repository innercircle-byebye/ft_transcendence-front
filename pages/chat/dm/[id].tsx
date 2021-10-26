import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useEffect } from 'react';
import ChatLayout from '@/layouts/ChatLayout';
import useSocket from '@/hooks/useSocket';

const DM = () => {
  const router = useRouter();
  const DMUserName = router.query.name;
  const { socket } = useSocket('chat');

  const onMessage = useCallback(
    (data: any) => {
      console.log(data);
    },
    [],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);
  console.log('in DM');

  return (
    <div className="h-full flex flex-col" role="button" tabIndex={0}>
      <div className="h-full flex flex-col">
        <div className="font-semibold text-2xl pl-6">
          {/* {`# ${channelData?.name}`} */}
          {DMUserName}
        </div>
        <div className="flex-1">
          {/* {
            chatDatas?.map((chatData) => (
              <ChatItem
                key={chatData.channelChatId}
                chatData={chatData}
              />
            ))
          } */}
          chatlist
        </div>
        chatbox
        {/*
        <ChatBox
          // chat={chat}
          // onChangeChat={onChangeChat}
          // setChat={setChat}
          // onSubmitChat={onSubmitChat}
          // showEmoji={showEmoji}
          // setShowEmoji={setShowEmoji}
        />
        */}
      </div>
    </div>
  );
};

DM.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default DM;
