import ChannelList from "@/components/chat-page/ChannelList";
import DMList from "@/components/chat-page/DMList";
import Navbar from "@/components/Navbar";
import React, { FC } from "react";

const ChatLayout: FC = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
      <Navbar />
      </div>
      <div className="bg-sky-100 flex flex-row p-4 space-x-4 h-auto flex-1">
        <div className="flex flex-col space-y-4 w-60">
          {/* <div className="flex-1"> */}
            <ChannelList />
          {/* </div> */}
          <div className="flex-1">
            <DMList />
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default ChatLayout;