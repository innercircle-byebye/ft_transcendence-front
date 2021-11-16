import {
  Dispatch,
  forwardRef, MutableRefObject, SetStateAction, useCallback,
} from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import useSWR from 'swr';
import {
  IChannel, IDMChat, IGameRoom, IUser,
} from '@/typings/db';
import ChatItem from '@/components/chat-page/chat/ChatItem';
import InviteItem from '../chat/InviteItem';
import fetcher from '@/utils/fetcher';

interface IProps {
  chatSections: { [key: string]: (IDMChat)[] };
  setSize: (f: (size: number) => number) => Promise<IDMChat[][] | undefined>;
  isReachingEnd: boolean;
  setPrivateChannelToJoin: Dispatch<SetStateAction<IChannel | null>>;
  setPrivateGameToJoin: Dispatch<SetStateAction<IGameRoom | null>>;
}

const DMChatList = forwardRef<Scrollbars, IProps>((
  {
    chatSections, setSize, isReachingEnd, setPrivateChannelToJoin, setPrivateGameToJoin,
  }, scrollRef,
) => {
  const { data: allChannelData } = useSWR<IChannel[]>('/api/channel', fetcher);
  const { data: allGameRoom } = useSWR<IGameRoom[]>('/api/game/room/list', fetcher);
  const { data: blockMemberData } = useSWR<IUser[]>('/api/block/list', fetcher);

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
        {Object.entries(chatSections).map(([date, dmChatDatas]) => (
          <div key={date} className="mt-3 border-t-2 border-sky-700">
            <div className="flex justify-center w-full sticky top-3">
              <button type="button" className="relative px-2 -top-3 bg-white z-10 outline-none rounded-full border-2 border-sky-700">
                {date}
              </button>
            </div>
            {dmChatDatas.map((chat) => {
              console.log(chat);
              if (blockMemberData?.map(
                (blockMember) => blockMember.userId,
              ).includes(chat.sender.userId)) {
                return null;
              }
              if ((allChannelData && chat.type === 'channel_invite' && !allChannelData.map((v) => v.name).includes(chat.content))
              || (allGameRoom && chat.type === 'game_invite' && !allGameRoom.map((v) => v.gameRoomId).includes(Number(chat.content)))) {
                return null;
              }
              if (chat.type === 'channel_invite' || chat.type === 'game_invite') {
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
                    setPrivateChannelToJoin={setPrivateChannelToJoin}
                    setPrivateGameToJoin={setPrivateGameToJoin}
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
