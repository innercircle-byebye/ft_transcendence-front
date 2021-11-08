import router from 'next/router';
import {
  Dispatch, SetStateAction, useCallback, VFC,
} from 'react';

interface IProps {
  roomNumber: number;
  setRoomToEntrance: Dispatch<SetStateAction<number | null>>;
}

const EntranceModal: VFC<IProps> = ({ roomNumber, setRoomToEntrance }) => {
  const onClickCloseModal = useCallback(() => {
    setRoomToEntrance(null);
  }, [setRoomToEntrance]);

  const onClickWatch = useCallback(() => {
    console.log('관전하기');
  }, []);

  const onClickPlay = useCallback(() => {
    console.log('게임하기');
    // test 를 위해 추가
    router.push('/play/room/2');
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="relative bg-amber-50 p-10 rounded-xl space-y-2">
        <button type="button" onClick={onClickCloseModal}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute top-3 right-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <p className="text-4xl">{`#${roomNumber}  ${roomNumber}번방입니다.`}</p>
        <p className="text-center text-xl">kycho  vs  mykang</p>
        <div className="flex justify-evenly">
          <button type="button" onClick={onClickWatch} className="bg-green-500 p-2 rounded-xl">관전하기</button>
          <button type="button" onClick={onClickPlay} className="bg-blue-500 p-2 rounded-xl">게임하기</button>
        </div>
      </div>
    </div>
  );
};

export default EntranceModal;
