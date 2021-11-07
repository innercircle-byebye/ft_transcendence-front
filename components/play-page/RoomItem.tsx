import {
  Dispatch, SetStateAction, useCallback, VFC,
} from 'react';

interface IProps {
  roomNumber: number;
  setRoomToEntrance: Dispatch<SetStateAction<number | null>>;
}

const RoomItem: VFC<IProps> = ({ roomNumber, setRoomToEntrance }) => {
  const onClickEntrance = useCallback(() => {
    console.log('입장하기');
    setRoomToEntrance(roomNumber);
  }, [roomNumber, setRoomToEntrance]);

  return (
    <div className="bg-blue-600 p-5 space-y-5 rounded-xl">
      <p className="text-3xl font-semibold text-white text-center">{`#${roomNumber}  ${roomNumber}번방입니다.`}</p>
      <div className="grid grid-cols-3 justify-items-center">
        <div className="col-span-2 text-center space-y-2">
          <p className="text-xl text-white">kycho vs mykang</p>
          <p className="text-xl text-white">3/4</p>
        </div>
        <button type="button" onClick={onClickEntrance} className="bg-green-500 text-xl p-3 rounded-md">입장하기</button>
      </div>
    </div>
  );
};

export default RoomItem;
