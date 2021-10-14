import ChatLayout from "@/layouts/ChatLayout";
import MainLayout from "@/layouts/MainLayout";
import React, { ReactElement } from "react";

const Chat = () => {
  return <div>chat</div>;
};

Chat.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <ChatLayout />
    </MainLayout>
  );
};


export default Chat;
