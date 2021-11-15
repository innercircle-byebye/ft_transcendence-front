import { VFC } from 'react';

interface IProps {
  onKeyPressHandler: (e: any) => void;
  gameChat: string;
  onChangeGameChat: (e: any) => void;
}

const ChatInputBox: VFC<IProps> = ({
  onKeyPressHandler, gameChat, onChangeGameChat,
}) => (
  <div>
    <input
      type="text"
      className="w-full h-1/12 rounded-sm text-gray-900"
      onChange={onChangeGameChat}
      onKeyPress={onKeyPressHandler}
      placeholder="아무거나 쓰셔"
      value={gameChat}
    />
  </div>
);

export default ChatInputBox;
