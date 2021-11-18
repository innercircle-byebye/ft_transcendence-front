import { Dispatch, SetStateAction } from 'react';
import { IGameRoom } from '@/typings/db';

const checkIsPlayButtonDisabled = (
  setIsPlayButtonDisabled: Dispatch<SetStateAction<boolean>>,
  roomToEntrance: IGameRoom | null,
) => {
  setIsPlayButtonDisabled(false);
  if (roomToEntrance) {
    // 1p 와 2p 가 존재한다면 해당 버튼을 disabled true 로 세팅
    if (roomToEntrance.gameMembers.find((v) => v.status === 'player1')
    && roomToEntrance.gameMembers.find((v) => v.status === 'player2')
    ) {
      setIsPlayButtonDisabled(true);
    }
  }
};

export default checkIsPlayButtonDisabled;
