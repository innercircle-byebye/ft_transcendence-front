import React, {
  ChangeEvent,
  VFC,
} from 'react';
import InputNumber from '../inputs/InputNumber';

interface IProps {
  title: string;
  onChangeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
  difficulty: number;
  onChangeDifficulty: (e: ChangeEvent<HTMLInputElement>) => void;
  winScore: number;
  onChangeWinScore: (e: ChangeEvent<HTMLInputElement>) => void;
  numOfParticipant: number;
  onChangeNumOfParticipant: (e: ChangeEvent<HTMLInputElement>) => void;
  onClickShowPasswordInputBox: () => void;
  isShowPasswordInputBox: boolean;
  roomPassword: string;
  onChangeRoomPassword: (e: ChangeEvent<HTMLInputElement>) => void
  onClickGameOptionApplyButton: () => void;
  onClickGameOptionCancleButton: () => void;
}

const GameOptionModal: VFC<IProps> = ({
  title,
  onChangeTitle,
  difficulty,
  onChangeDifficulty,
  winScore,
  onChangeWinScore,
  numOfParticipant,
  onChangeNumOfParticipant,
  onClickShowPasswordInputBox,
  isShowPasswordInputBox,
  roomPassword,
  onChangeRoomPassword,
  onClickGameOptionApplyButton,
  onClickGameOptionCancleButton,
}) => (
  <div className="absolute top-1/4 left-1/3 w-1/3 bg-amber-100 rounded-md p-5 space-y-5">
    {/* title */}
    <div className="font-medium text-lg text-center">Chang Game Room Option</div>
    {/* room name */}
    <div className="flex justify-between">
      <div>room name</div>
      <input
        className="border-none"
        type="text"
        placeholder={title}
        onChange={onChangeTitle}
        value={title}
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
      <InputNumber type="승리점수(2 ~ 10)" value={winScore} onChangeValue={onChangeWinScore} min={2} max={10} />
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
        className="bg-blue-200 rounded-md px-2"
        onClick={onClickShowPasswordInputBox}
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

export default GameOptionModal;
