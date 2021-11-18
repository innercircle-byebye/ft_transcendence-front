import {
  forwardRef, MutableRefObject, useCallback,
} from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { IGameChat } from '@/typings/db';

interface IProps {
  gameChatList: IGameChat[];
}

const GameChatList = forwardRef<Scrollbars, IProps>((
  { gameChatList }, scrollRef,
) => {
  const onScroll = useCallback(
    (values) => {
      const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
      if (current) {
        current.scrollTop(values.scrollHeight);
      }
    },
    [scrollRef],
  );

  return (
    <div className="w-full flex-1 bg-sky-200">
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {gameChatList.map((item: IGameChat) => (
          <div
            key={item.index}
            className="pl-2 font-medium"
          >
            {`${item.nickname} : ${item.content}`}
          </div>
        ))}
      </Scrollbars>
    </div>
  );
});

GameChatList.displayName = 'GameChatList';

export default GameChatList;
