import {
  Dispatch, SetStateAction, useCallback, useState, VFC,
} from 'react';
import { IGameRoom } from '@/typings/db';

interface IProps {
  roomInfo: IGameRoom;
  setRoomToEntrance: Dispatch<SetStateAction<IGameRoom | null>>;
}

const RoomItem: VFC<IProps> = ({ roomInfo, setRoomToEntrance }) => {
  const [player1] = useState(roomInfo.gameMembers.find((v) => v.status === 'player1'));
  const [player2] = useState(roomInfo.gameMembers.find((v) => v.status === 'player2'));

  const onClickEntrance = useCallback(() => {
    setRoomToEntrance(roomInfo);
  }, [roomInfo, setRoomToEntrance]);

  return (
    <div className={`${roomInfo.isPrivate ? 'bg-yellow-400 text-amber-900' : 'bg-blue-600 text-white'} p-4 space-y-5 rounded-xl`}>
      <p className={`${roomInfo.title.length > 10 ? 'text-2xl' : 'text-3xl'} font-semibold text-center`}>{`#${roomInfo.gameRoomId}  ${roomInfo.title}`}</p>
      <div className="grid grid-cols-3 justify-items-center">
        <div className="col-span-2 text-center space-y-2">
          <p className="text-xl">
            {`${player1 ? player1.nickname : ''} vs ${player2 ? player2.nickname : ''}`}
          </p>
          <p>
            {`${roomInfo.currentMemberCount} / ${roomInfo.maxParticipantNum}`}
          </p>
        </div>
        {roomInfo.currentMemberCount === roomInfo.maxParticipantNum
          ? <button type="button" className="bg-red-500 text-white text-xl p-3 rounded-md">인원초과</button>
          : <button type="button" onClick={onClickEntrance} className="bg-green-500 text-black text-xl p-3 rounded-md">입장하기</button>}
      </div>
    </div>
  );
};

export default RoomItem;
