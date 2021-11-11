import { VFC } from 'react';

interface IProps {
  question: string;
  onClickYes: () => void;
  onClickNo: () => void;
  yesButtonColor?: string;
  noButtonColor?: string;
}

const ChatTwoButtonModal: VFC<IProps> = ({
  question, onClickYes, onClickNo, yesButtonColor = 'bg-gray-200', noButtonColor = 'bg-gray-200',
}) => (
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-xl z-10">
    <div className="flex flex-col items-center bg-amber-100 space-y-8 p-6 rounded-xl">
      <div className="text-3xl">{question}</div>
      <div className="flex flex-row space-x-8">
        <button type="button" onClick={onClickYes} className={`${yesButtonColor} text-2xl px-10 py-2 rounded-full`}>네</button>
        <button type="button" onClick={onClickNo} className={`${noButtonColor} text-2xl px-6 py-2 rounded-full`}>아니오</button>
      </div>
    </div>
  </div>
);

export default ChatTwoButtonModal;
