import React, {
  Dispatch,
  SetStateAction,
  useCallback, useEffect, useState, VFC,
} from 'react';
import useInput from '@/hooks/useInput';
import InputNumber from '../inputs/InputNumber';
import { IGameRoom } from '@/typings/db';

interface IProps {
  onClickGameOptionApplyButton: () => void;
  onClickGameOptionCancleButton: () => void;
  gameRoomData: IGameRoom | undefined;
  setBallSpeed: Dispatch<SetStateAction<string>>;
}

const GameOptionModal: VFC<IProps> = ({
  onClickGameOptionApplyButton,
  onClickGameOptionCancleButton,
  gameRoomData,
  setBallSpeed,
}) => {
  const [roomName, onChangeRoomName] = useInput('');
  // public | private state
  const [isShowPasswordInputBox, setIsShowPasswordInputBox] = useState<boolean>(false);
  const [roomPassword, onChangeRoomPassword] = useInput('');
  const [difficulty, onChangeDifficulty] = useInput(0);
  const [winScore, onChangeWinScore, setWinScore] = useInput(5);
  const [numOfParticipant, onChangeNumOfParticipant, setNumOfParticipant] = useInput(5);

  console.log('gameData 이거 맞아?', gameRoomData);
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

  useEffect(() => {
    if (difficulty === 0) { setBallSpeed('slow'); }
    if (difficulty === 1) { setBallSpeed('medium'); }
    if (difficulty === 2) { setBallSpeed('fast'); }
  }, [difficulty, setBallSpeed]);

  useEffect(() => {
    if (winScore < 1) setWinScore(1);
    if (winScore > 10) setWinScore(10);
  }, [setWinScore, winScore]);

  useEffect(() => {
    if (numOfParticipant < 2) setNumOfParticipant(2);
    if (numOfParticipant > 8) setNumOfParticipant(8);
  }, [numOfParticipant, setNumOfParticipant]);

  return (
    <div className="absolute top-1/4 left-1/3 bg-white rounded-md p-5 space-y-5">
      {/* title */}
      <div className="font-medium text-lg text-center">Chang Game Room Option</div>
      {/* room name */}
      <div className="flex justify-between">
        <div>room name</div>
        <input
          className="border-none"
          type="text"
          placeholder={gameRoomData ? gameRoomData.title : 'loading title'}
          onChange={onChangeRoomName}
          value={roomName}
        />
      </div>
      {/* 난이도 */}
      <div className="flex justify-between">
        <div>난이도</div>
        <input type="range" min="0" max="2" value={difficulty} onChange={onChangeDifficulty} list="tickmarks" className="outline-none" />
        <datalist id="tickmarks">
          <option value="0" label="0%" />
          <option value="1" label="50%" />
          <option value="2" label="100%" />
        </datalist>
      </div>
      {/* 승리점수 */}
      <div className="flex justify-between">
        <InputNumber type="승리점수(1 ~ 10)" value={winScore} onChangeValue={onChangeWinScore} min={1} max={10} />
      </div>
      {/* 최대인원 */}
      <div className="flex justify-between">
        <InputNumber type="인원수(2 ~ 8)" value={numOfParticipant} onChangeValue={onChangeNumOfParticipant} min={2} max={8} />
      </div>
      {/* 최대인원 */}
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
