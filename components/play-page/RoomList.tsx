import {
  Dispatch, SetStateAction, VFC,
} from 'react';
import EntranceModal from '@/components/play-page/EntranceModal';
import RoomItem from '@/components/play-page/RoomItem';

interface IProps {
  roomToEntrance: number | null;
  setRoomToEntrance: Dispatch<SetStateAction<number | null>>;
}

const RoomList: VFC<IProps> = ({ roomToEntrance, setRoomToEntrance }) => (
  <div className="relative">
    <div className="grid grid-cols-2 grid-rows-4 gap-5 p-5 h-full w-full">
      <RoomItem roomNumber={1} setRoomToEntrance={setRoomToEntrance} />
      <RoomItem roomNumber={2} setRoomToEntrance={setRoomToEntrance} />
      <RoomItem roomNumber={3} setRoomToEntrance={setRoomToEntrance} />
      <RoomItem roomNumber={4} setRoomToEntrance={setRoomToEntrance} />
      <RoomItem roomNumber={5} setRoomToEntrance={setRoomToEntrance} />
      <RoomItem roomNumber={6} setRoomToEntrance={setRoomToEntrance} />
      <RoomItem roomNumber={7} setRoomToEntrance={setRoomToEntrance} />
      <RoomItem roomNumber={8} setRoomToEntrance={setRoomToEntrance} />
    </div>
    {roomToEntrance && (
    <EntranceModal roomNumber={roomToEntrance} setRoomToEntrance={setRoomToEntrance} />
    )}
  </div>
);

export default RoomList;
