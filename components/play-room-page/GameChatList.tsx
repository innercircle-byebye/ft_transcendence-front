import { VFC } from 'react';
import { IGameChat } from '@/typings/db';

interface IProps {
  gameChatList: IGameChat[];
}

const GameChatList: VFC<IProps> = ({
  gameChatList,
}) => (
  <div className="w-full h-11/12 max-h-11/12 bg-sky-200 overflow-y-auto">
    {gameChatList.map((item: IGameChat) => (
      <div
        key={item.index}
        className="pl-2 font-medium"
      >
        {`${item.nickname} : ${item.content}`}
      </div>
    ))}
  </div>
);

export default GameChatList;
