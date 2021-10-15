import ChatLayout from "@/layouts/ChatLayout";
import React, { ReactElement } from "react";

const Chat = () => {
  return <div className="font-bold">chat</div>;
};

Chat.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default Chat;