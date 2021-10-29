import { FC } from 'react';
// import Image from 'next/image';
import { IChannelChat } from '@/typings/db';

interface Props {
  chatData: IChannelChat;
}

const ChatItem: FC<Props> = ({ chatData }) => (
  <div className="flex flex-row">
    {/* <div className="relative bg-blue-300 w-5 h-5 rounded-full shadow-lg mr-2">
      <Image
        src={user.imagePath}
        alt="previewImage"
        objectFit="cover"
        layout="fill"
        className="rounded-full"
      />
    </div> */}
    {`${chatData.createdAt} ${chatData.userId} ${chatData.content}`}
  </div>
);

export default ChatItem;
