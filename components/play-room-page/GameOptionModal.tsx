import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  VFC,
} from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IGameOption, IGameRoom } from '@/typings/db';
import InputNumber from '../inputs/InputNumber';
import fetcher from '@/utils/fetcher';
import useInput from '@/hooks/useInput';

interface IProps {
  roomInitialData: IGameRoom;
  myRole: string;
  setTitle: Dispatch<SetStateAction<string>>;
  setIsShowGameOptionModal: Dispatch<SetStateAction<boolean>>;
}

const GameOptionModal: VFC<IProps> = ({
  roomInitialData,
  myRole,
  setTitle,
  setIsShowGameOptionModal,
}) => {
  const router = useRouter();
  const roomNumber = router.query.id;
  const { data: roomData, revalidate: revalidateRoomData } = useSWR<IGameRoom | null>(`/api/game/room/${roomNumber}`, fetcher, {
    initialData: roomInitialData,
  });
  const [newTitle, onChangeNewTitle] = useInput<string>(roomData ? roomData.title : '');
  const [newDifficulty, onChangeNewDifficulty, setNewDifficulty] = useInput<string>('');
  const [newWinScore, onChangeNewWinScore, setNewWinScore] = useInput<number>(
    roomData ? roomData.gameResults[roomData?.gameResults.length - 1].winPoint : 0,
  );
  const [numOfParticipant, onChangeNumOfParticipant, setNumOfParticipant] = useInput(
    roomData ? roomData.maxParticipantNum : 0,
  );
  const [showPasswordInputBox, setShowPasswordInputBox] = useState<boolean>(false);
  const [roomPassword, onChangeRoomPassword, setRoomPassword] = useInput<string>('');

  const onClickGameOptionApplyButton = useCallback(() => {
    let newBallSpeed: string;
    if (newDifficulty === '2') newBallSpeed = 'fast';
    else if (newDifficulty === '1') newBallSpeed = 'medium';
    else newBallSpeed = 'slow';
    const newPatchData: IGameOption = {
      title: newTitle,
      maxParticipantNum: numOfParticipant,
      winPoint: newWinScore,
      ballSpeed: newBallSpeed,
      password: undefined,
    };
    if (!showPasswordInputBox) {
      newPatchData.password = null;
    } else if (roomPassword) {
      newPatchData.password = roomPassword;
    }
    axios.patch(`/api/game/room/${roomNumber}`,
      newPatchData,
      {
        headers: {
          withCredentials: 'true',
        },
      })
      .then(() => {
        revalidateRoomData();
        setTitle(newTitle);
        setIsShowGameOptionModal(false);
      })
      .catch(() => {
        toast.error('옵션 설정에 실패했습니다.', { position: 'bottom-right', theme: 'colored' });
      });
  }, [newDifficulty, newTitle, newWinScore, numOfParticipant, revalidateRoomData, roomNumber,
    roomPassword, setIsShowGameOptionModal, setTitle, showPasswordInputBox,
  ]);

  const onClickGameOptionCancleButton = useCallback(() => {
    if (roomData) {
      setTitle(roomData.title);
      setNumOfParticipant(roomData.maxParticipantNum);
      setNewWinScore(roomData.gameResults[roomData.gameResults.length - 1].winPoint);
    }
    setIsShowGameOptionModal(false);
  }, [roomData, setNumOfParticipant, setIsShowGameOptionModal,
    setTitle, setNewWinScore]);

  const onSubmitPassword = useCallback(() => {
    console.log('이것도 됩니까?');
    setRoomPassword('');
  }, [setRoomPassword]);

  const onClickShowPasswordInputBox = useCallback(() => {
    setShowPasswordInputBox((prev) => !prev);
  }, []);

  useEffect(() => {
    const ballSpeed = roomData ? roomData.gameResults[roomData?.gameResults.length - 1].ballSpeed : '';
    if (ballSpeed === 'slow') {
      setNewDifficulty('0');
    } else if (ballSpeed === 'medium') {
      setNewDifficulty('1');
    } else if (ballSpeed === 'fast') {
      setNewDifficulty('2');
    }
  }, [roomData, setNewDifficulty]);

  useEffect(() => {
    if (newWinScore < 2) setNewWinScore(2);
    if (newWinScore > 10) setNewWinScore(10);
  }, [setNewWinScore, newWinScore]);

  useEffect(() => {
    if (numOfParticipant) {
      if (numOfParticipant < 2) setNumOfParticipant(2);
      if (numOfParticipant > 8) setNumOfParticipant(8);
    }
  }, [numOfParticipant, setNumOfParticipant]);

  if (roomData === null) {
    router.push('/play');
    return null;
  }

  if (myRole === 'player1') {
    return (
      <div className="absolute top-1/4 left-1/3 w-1/3 bg-amber-100 rounded-md p-5 space-y-5">
        {/* title */}
        <div className="font-medium text-lg text-center">Chang Game Room Option</div>
        {/* room name */}
        <div className="flex justify-between">
          <div>room name</div>
          <input
            className="border-none"
            type="text"
            placeholder={roomData?.title}
            onChange={onChangeNewTitle}
            value={newTitle}
          />
        </div>
        {/* 난이도 */}
        <div className="flex justify-between">
          <div>난이도</div>
          <input type="range" min="0" max="2" value={newDifficulty} onChange={onChangeNewDifficulty} list="tickmarks" className="outline-none" />
          <datalist id="tickmarks">
            <option value="0" label="0%" />
            <option value="1" label="50%" />
            <option value="2" label="100%" />
          </datalist>
        </div>
        {/* 승리점수 */}
        <div className="flex justify-between">
          <InputNumber type="승리점수(2 ~ 10)" value={newWinScore} onChangeValue={onChangeNewWinScore} min={2} max={10} />
        </div>
        {/* 최대인원 */}
        <div className="flex justify-between">
          <InputNumber type="인원수(2 ~ 8)" value={numOfParticipant} onChangeValue={onChangeNumOfParticipant} min={2} max={8} />
        </div>
        {/* 최대인원 */}
        {/* public | private */}
        <div className="flex justify-between">
          <div>public / private</div>
          <button
            type="button"
            className="bg-blue-200 rounded-md px-2"
            onClick={onClickShowPasswordInputBox}
          >
            switch
          </button>
          {showPasswordInputBox && (
          <input
            type="password"
            value={roomPassword}
            onChange={onChangeRoomPassword}
            onSubmit={onSubmitPassword}
            placeholder=""
            maxLength={4}
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
  }
  return (
    <div className="absolute top-1/4 left-1/3 w-1/3 bg-amber-100 rounded-md p-5 space-y-5">
      {/* title */}
      <div className="font-medium text-lg text-center">Chang Game Room Option</div>
      {/* room name */}
      <div className="flex justify-between">
        <div>room name</div>
        <div>{roomData?.title}</div>
      </div>
      {/* 난이도 */}
      <div className="flex justify-between">
        <div>난이도</div>
        <div>{roomData?.gameResults[roomData.gameResults.length - 1].ballSpeed}</div>
      </div>
      {/* 승리점수 */}
      <div className="flex justify-between">
        <div>승리점수</div>
        <div>{roomData?.gameResults[roomData.gameResults.length - 1].winPoint}</div>
      </div>
      {/* 최대인원 */}
      <div className="flex justify-between">
        <div>최대인원</div>
        <div>{roomData?.maxParticipantNum}</div>
      </div>
      {/* apply & cancle button */}
      <div className="flex space-x-5 justify-center">
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
