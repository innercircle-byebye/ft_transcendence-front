import { useRouter } from 'next/router';
import { useState } from 'react';
import GameScreen from '@/components/play-room-page/GameScreen';

const Room = () => {
  const router = useRouter();
  const roomNumber = router.query.id;
  const [isChatting, setIsChatting] = useState(true);

  return (
    <div className="flex justify-center">
      {/* game screen */}
      <div className="w-3/4 pb-1/2 bg-sky-100 relative">
        <GameScreen />
      </div>
      {/* info screen */}
      <div className="w-1/4 bg-amber-100">
        <div className="bg-gray-400 h-1/12 text-center">
          {`# ${roomNumber} 방제목 api 로 받아서 사용하시오`}
        </div>
        <div className="bg-red-300 h-1/4">
          {/* player Info */}
          player 1 & player 2
        </div>
        <div className="bg-green-300 h-1/12">
          {/* play room buttons */}
          3button opt & replace & exit
        </div>
        <div className="bg-sky-300 h-7/12">
          {/* participant chatting swap button */}
          <div className="flex h-1/12">
            <button
              type="button"
              onClick={() => setIsChatting(true)}
              className={`w-1/2 ${isChatting && 'bg-sky-200'} ${!isChatting && 'bg-gray-400'}`}
            >
              chatting
            </button>
            <button
              type="button"
              onClick={() => setIsChatting(false)}
              className={`w-1/2 ${!isChatting && 'bg-sky-200'} ${isChatting && 'bg-gray-400'}`}
            >
              participant
            </button>
          </div>
          <div>
            {isChatting ? (
              <div>
                채팅입니다.
              </div>
            ) : (
              <div>
                관전자입니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
