import { VFC } from 'react';
import { IGameChat } from '@/typings/db';

interface IProps {
  gameChatList: IGameChat[];
}

const GameChatList: VFC<IProps> = ({
  gameChatList,
}) => {
  console.log('chat data', gameChatList);

  return (
    <div className="w-full h-11/12 bg-amber-100">
      {gameChatList.map((item: IGameChat) => (
        <div
          key={1}
          className="pl-2 font-medium"
        >
          {`${item.nickname} : ${item.content}`}
        </div>
      ))}
    </div>
  );
};
export default GameChatList;
