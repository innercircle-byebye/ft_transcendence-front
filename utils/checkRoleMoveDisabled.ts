import { Dispatch, SetStateAction } from 'react';
import { IGameRoomData } from '@/typings/db';

const checkRoleMoveDisabled = (
  setIsRoleMoveDisabled: Dispatch<SetStateAction<boolean>>,
  data: IGameRoomData,
) => {
  setIsRoleMoveDisabled(false);
  // 게임 중이 아닌 경우
  // 내가 1P 이고, 1P 만 있다면 disable 시킨다.
  if (data.role === 'player1') {
    if (!data.participants.player2 && (data.participants.observers.length === 0)) {
      setIsRoleMoveDisabled(true);
    }
  } else if (data.role === 'observer') {
    // 내가 observer 이고, 1p 와 2p 가 만석인 경우 disable 시킨다.
    if (data.participants.player1 && data.participants.player2) {
      setIsRoleMoveDisabled(true);
    }
  }
};

export default checkRoleMoveDisabled;
