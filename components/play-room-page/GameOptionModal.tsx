import { useCallback, useState, VFC } from 'react';
import useInput from '@/hooks/useInput';

interface IProps {
  onClickGameOptionApplyButton: () => void;
  onClickGameOptionCancleButton: () => void;
}

const GameOptionModal: VFC<IProps> = ({
  onClickGameOptionApplyButton,
  onClickGameOptionCancleButton,
}) => {
  const [roomName, onChangeRoomName] = useInput('');
  // public | private state
  const [isShowPasswordInputBox, setIsShowPasswordInputBox] = useState<boolean>(false);
  const [roomPassword, onChangeRoomPassword] = useInput('');

  const onChangeShowPasswordInputBox = useCallback(
    () => {
      if (isShowPasswordInputBox) {
        setIsShowPasswordInputBox(false);
      } else {
        setIsShowPasswordInputBox(true);
      }
    },
    [isShowPasswordInputBox],
  );

  return (
    <div className="absolute top-1/2 left-1/2 bg-white rounded-md p-5 space-y-5">
      {/* title */}
      <div className="font-medium text-lg text-center">Chang Game Room Option</div>
      {/* room name */}
      <div className="flex justify-between">
        <div>room name</div>
        <input
          className="border-none"
          type="text"
          placeholder="박찬영 바보"
          onChange={onChangeRoomName}
          value={roomName}
        />
      </div>
      {/* 난이도 */}
      <div className="flex justify-between">
        <div>난이도</div>
        <select className="border-none" id="slt_difficulty">
          <option value="EASY">쉬움</option>
          <option value="NORMAL">보통</option>
          <option value="HARD">어려움</option>
        </select>
      </div>
      {/* 승리점수 */}
      <div className="flex justify-between">
        <div>승리점수</div>
        <select className="border-none" id="slt_score">
          <option value="A">1</option>
          <option value="B">2</option>
          <option value="C">3</option>
          <option value="D">4</option>
          <option value="E">5</option>
        </select>
      </div>
      {/* 최대인원 */}
      <div className="flex justify-between">
        <div>최대인원</div>
        <select className="border-none">
          <option value="A">5</option>
          <option value="B">6</option>
          <option value="C">7</option>
        </select>
      </div>
      {/* public | private */}
      <div className="flex justify-between">
        <div>public / private</div>
        {/* 이곳에 switch box 를 추가해주세요 */}
        <button
          type="button"
          className="bg-blue-200"
          onChange={onChangeShowPasswordInputBox}
        >
          switch
        </button>
        {isShowPasswordInputBox && (
          <input
            type="text"
            value={roomPassword}
            onChange={onChangeRoomPassword}
          />
        )}
      </div>
      {/* apply & cancle button */}
      <div className="flex space-x-5 justify-center">
        <button
          type="button"
          className="bg-amber-200 p-2 rounded-md"
          onClick={onClickGameOptionApplyButton}
        >
          APPLY
        </button>
        <button
          type="button"
          className="bg-gray-400 p-2 rounded-md"
          onClick={onClickGameOptionCancleButton}
        >
          CANCLE
        </button>
      </div>
    </div>
  );
};

export default GameOptionModal;
