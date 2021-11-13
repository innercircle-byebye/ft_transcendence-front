import React, {
  forwardRef, MutableRefObject, useCallback,
} from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import useSWR from 'swr';
import { IChannelChat, IChannelMember } from '@/typings/db';
import ChatItem from './ChatItem';
import fetcher from '@/utils/fetcher';

interface IProps {
  chatSections: { [key: string]: (IChannelChat)[] };
  setSize: (f: (size: number) => number) => Promise<IChannelChat[][] | undefined>;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, IProps>((
  { chatSections, setSize, isReachingEnd }, scrollRef,
) => {
  const { data: blockMemberData } = useSWR<IChannelMember[]>('/api/block/list', fetcher);

  const onScroll = useCallback(
    (values) => {
      if (values.scrollTop === 0 && !isReachingEnd) {
        setSize((prevSize) => prevSize + 1).then(() => {
          const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
          if (current) {
            current.scrollTop(current.getScrollHeight() - values.scrollHeight);
          }
        });
      }
    },
    [isReachingEnd, scrollRef, setSize],
  );

  return (
    <div className="flex-1 w-full">
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, channelChatDatas]) => (
          <div key={date} className="mt-3 border-t-2 border-sky-700">
            <div className="flex justify-center w-full sticky top-3">
              <button type="button" className="relative px-2 -top-3 bg-white z-10 outline-none rounded-full border-2 border-sky-700">
                {date}
              </button>
            </div>
            {channelChatDatas.map((chat) => {
              if (blockMemberData?.map((member) => member.userId).includes(chat.userId)) {
                return null;
              }
              return (
                <ChatItem
                  key={chat.channelChatId + chat.user.nickname}
                  chatData={{
                    userId: chat.userId,
                    nickname: chat.user.nickname,
                    imagePath: chat.user.imagePath,
                    content: chat.content,
                    createdAt: chat.createdAt,
                  }}
                />
              );
            })}
          </div>
        ))}
      </Scrollbars>
    </div>
  );
});

ChatList.displayName = 'ChatList';

export default ChatList;
