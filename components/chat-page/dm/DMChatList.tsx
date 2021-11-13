import React, {
  forwardRef, MutableRefObject, useCallback,
} from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { IDMChat } from '@/typings/db';
import ChatItem from '@/components/chat-page/chat/ChatItem';
import InviteItem from '../chat/InviteItem';

interface IProps {
  chatSections: { [key: string]: (IDMChat)[] };
  setSize: (f: (size: number) => number) => Promise<IDMChat[][] | undefined>;
  isReachingEnd: boolean;
}

const DMChatList = forwardRef<Scrollbars, IProps>((
  { chatSections, setSize, isReachingEnd }, scrollRef,
) => {
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
              if (chat.type !== 'plain') {
                return (
                  <InviteItem
                    key={chat.dmId.toString() + chat.createdAt}
                    invitationData={{
                      userId: chat.sender.userId,
                      nickname: chat.sender.nickname,
                      imagePath: chat.sender.imagePath,
                      content: chat.content,
                      createdAt: chat.createdAt,
                      type: chat.type,
                    }}
                  />
                );
              }
              return (
                <ChatItem
                  key={chat.dmId.toString() + chat.createdAt}
                  chatData={{
                    userId: chat.sender.userId,
                    nickname: chat.sender.nickname,
                    imagePath: chat.sender.imagePath,
                    content: chat.content,
                    createdAt: chat.createdAt,
                    type: chat.type,
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

DMChatList.displayName = 'DMChatList';

export default DMChatList;
