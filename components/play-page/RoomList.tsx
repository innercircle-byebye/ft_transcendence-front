import {
  Dispatch, SetStateAction, VFC,
} from 'react';
import useSWR from 'swr';
import EntranceModal from '@/components/play-page/EntranceModal';
import RoomItem from '@/components/play-page/RoomItem';
import fetcher from '@/utils/fetcher';
import { IGameRoom } from '@/typings/db';

interface IProps {
  page: number;
  perPage: number;
  roomToEntrance: IGameRoom | null;
  setRoomToEntrance: Dispatch<SetStateAction<IGameRoom | null>>;
}

const RoomList: VFC<IProps> = ({
  page, perPage, roomToEntrance, setRoomToEntrance,
}) => {
  const { data: roomList } = useSWR<IGameRoom[]>(`/api/game/room/list?perPage=${perPage}&page=${page}`, fetcher);

  if (!roomList) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="relative">
      {roomList.length ? (
        <div className="grid grid-cols-2 grid-rows-4 gap-5 p-5 h-full w-full">
          {roomList.map((room) => (
            <RoomItem
              key={room.gameRoomId}
              roomInfo={room}
              setRoomToEntrance={setRoomToEntrance}
            />
          ))}
        </div>
      ) : (
        <div className="text-3xl">게임방이 없습니다.</div>
      )}
      {roomToEntrance && (
      <EntranceModal roomInfo={roomToEntrance} setRoomToEntrance={setRoomToEntrance} />
      )}
    </div>
  );
};

export default RoomList;
