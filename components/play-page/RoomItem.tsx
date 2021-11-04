import {
  Dispatch, SetStateAction, useCallback, VFC,
} from 'react';
import { IGameRoom } from '@/typings/db';

interface IProps {
  roomInfo: IGameRoom;
  setRoomToEntrance: Dispatch<SetStateAction<IGameRoom | null>>;
}

const RoomItem: VFC<IProps> = ({ roomInfo, setRoomToEntrance }) => {
  const onClickEntrance = useCallback(() => {
    console.log('입장하기');
    setRoomToEntrance(roomInfo);
  }, [roomInfo, setRoomToEntrance]);

  return (
    <div className={`${roomInfo.isPrivate ? 'bg-yellow-400 text-amber-900' : 'bg-blue-600 text-white'} p-4 space-y-5 rounded-xl`}>
      <p className="text-2xl font-semibold text-center">{`#${roomInfo.gameRoomId}  ${roomInfo.title}`}</p>
      <div className="grid grid-cols-3 justify-items-center">
        <div className="col-span-2 text-center space-y-2">
          <p className="text-xl">
            {`${roomInfo.gameMembers.at(0) ? roomInfo.gameMembers.at(0)?.nickname : ''} vs ${roomInfo.gameMembers.at(1) ? roomInfo.gameMembers.at(1)?.nickname : ''}`}
          </p>
          <p>
            {`${roomInfo.currentNumberCount} / ${roomInfo.maxParticipantNum}`}
          </p>
        </div>
        {roomInfo.currentNumberCount === roomInfo.maxParticipantNum
          ? <button type="button" className="bg-red-500 text-white text-xl p-3 rounded-md">인원초과</button>
          : <button type="button" onClick={onClickEntrance} className="bg-green-500 text-black text-xl p-3 rounded-md">입장하기</button>}
      </div>
    </div>
  );
};

export default RoomItem;
