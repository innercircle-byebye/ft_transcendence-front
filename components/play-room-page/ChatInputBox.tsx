import { VFC } from 'react';
import useInput from '@/hooks/useInput';

interface IProps {
  onKeyPressHandler: (e: any) => void;
}

const ChatInputBox: VFC<IProps> = ({ onKeyPressHandler }) => {
  const [gameChat, onChangeGameChat] = useInput('');

  // [id] 로 이동시키자
  // const onKeyPressHandler = useCallback(
  //   (e) => {
  //     if (e.key === 'Enter') {
  //       socket?.emit('gameChat', e.target.value);
  //     }
  //   },
  //   [],
  // );

  return (
    <div>
      <input
        type="text"
        className="w-full rounded-sm text-gray-900"
        onChange={onChangeGameChat}
        onKeyPress={onKeyPressHandler}
        value={gameChat}
      />
    </div>
  );
};

export default ChatInputBox;
