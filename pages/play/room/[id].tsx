import { useRouter } from 'next/router';

const Room = () => {
  const router = useRouter();
  const roomNumber = router.query.id;

  return (
    <div className="flex justify-center">
      {/* game screen */}
      <div className="w-1/2 pb-1/2 bg-sky-100">
        <p className="absolute"> 게임 layout </p>
      </div>
      {/* info screen */}
      <div className="w-1/4 bg-amber-100">
        <div className="bg-gray-400 h-1/12 text-center">
          {`# ${roomNumber} 방제목 api 로 받아서 사용하시오`}
        </div>
        <div className="bg-red-300 h-1/4">
          player 1 & player 2
        </div>
        <div className="bg-green-300 h-1/12">
          3button opt & replace & exit
        </div>
        <div className="bg-sky-300 h-7/12">
          observer | chatting
        </div>
      </div>
    </div>
  );
};

export default Room;
