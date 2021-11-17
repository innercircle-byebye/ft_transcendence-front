import router from 'next/router';
import {
  Dispatch, SetStateAction, useCallback, useState, VFC,
} from 'react';
import axios from 'axios';
import { IGameRoom } from '@/typings/db';

interface IProps {
  roomInfo: IGameRoom;
  setRoomToEntrance: Dispatch<SetStateAction<IGameRoom | null>>;
}

const EntranceModal: VFC<IProps> = ({ roomInfo, setRoomToEntrance }) => {
  const [player1] = useState(roomInfo.gameMembers.find((v) => v.status === 'player1'));
  const [player2] = useState(roomInfo.gameMembers.find((v) => v.status === 'player2'));

  const onClickCloseModal = useCallback(() => {
    setRoomToEntrance(null);
  }, [setRoomToEntrance]);

  const onClickWatch = useCallback(() => {
    axios.post(`/api/game/room/${roomInfo.gameRoomId}/join`, {
      password: '',
      role: 'observer',
    }, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      console.log('post join 요청 성공');
      router.push(`/play/room/${roomInfo.gameRoomId}`);
    });
  }, [roomInfo.gameRoomId]);

  const onClickPlay = useCallback(() => {
    axios.post(`/api/game/room/${roomInfo.gameRoomId}/join`, {
      password: '',
      role: 'player2',
    }, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      console.log('post join 요청 성공');
      router.push(`/play/room/${roomInfo.gameRoomId}`);
    });
  }, [roomInfo.gameRoomId]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="relative bg-amber-50 p-8 rounded-xl space-y-2">
        <button type="button" onClick={onClickCloseModal}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute top-3 right-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <p className={`${roomInfo.title.length > 10 ? 'text-3xl' : 'text-4xl'}`}>{`#${roomInfo.gameRoomId}  ${roomInfo.title}`}</p>
        <p className="text-center text-2xl">
          {`${player1 ? player1.nickname : ''} vs ${player2 ? player2.nickname : ''}`}
        </p>
        <div className="flex justify-evenly">
          <button type="button" onClick={onClickWatch} className={`${roomInfo.currentMemberCount === roomInfo.maxParticipantNum ? 'bg-gray-400' : 'bg-green-500'} p-2 rounded-xl`}>
            관전하기
          </button>
          <button
            type="button"
            onClick={onClickPlay}
            disabled={roomInfo.gameMembers.length === 2}
            className={`${roomInfo.gameMembers.length === 2 ? 'bg-gray-400' : 'bg-blue-500'} p-2 rounded-xl`}
          >
            게임하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntranceModal;
