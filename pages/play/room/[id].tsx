import { useRouter } from 'next/router';
import {
  useCallback, useEffect, useState, VFC,
} from 'react';
import GameScreen from '@/components/play-room-page/GameScreen';
import RoomButtonList from '@/components/play-room-page/RoomButtonList';
import PlayerInfo from '@/components/play-room-page/PlayerInfo';
import useSocket from '@/hooks/useSocket';
import { IGameScreenData, IGameUpdateData } from '@/typings/db';
import ChatInputBox from '@/components/play-room-page/ChatInputBox';

const Room: VFC = () => {
  const router = useRouter();
  const roomNumber = router.query.id;
  const [isChatting, setIsChatting] = useState(true);
  const { socket, disconnect } = useSocket('game');
  const [isReady1P, setIsReady1P] = useState(false);
  const [isReady2P, setIsReady2P] = useState(false);
  const [initData, setInitData] = useState<IGameScreenData | null>(null);
  const [updateData, setUpdateData] = useState<IGameUpdateData[] | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    socket?.on('initSetting', (data: IGameScreenData) => {
      setInitData(data);
      // console.log('initData', data);
      // ready 상태 알려주면 그걸로 ready setting 해야합니다.
    });
    socket?.emit('joinGameRoom', router.query.id);
    return () => {
      disconnect();
    };
  }, [disconnect, router.query.id, socket]);

  useEffect(() => {
    // data update
    socket?.on('update', (data) => setUpdateData(data));
    // console.log('updateData', updateData);
  });

  // on ready unReady
  useEffect(() => {
    socket?.on('ready', (data) => {
      // console.log('ready data', data);
      if (data === 'player1') {
        setIsReady1P(true);
      } else if (data === 'player2') {
        setIsReady2P(true);
      }
    });
    socket?.on('unReady', (data) => {
      // console.log('unReady data', data);
      if (data === 'player1') {
        setIsReady1P(false);
      } else if (data === 'player2') {
        setIsReady2P(false);
      }
    });
  });

  const onClickExit = useCallback(
    () => {
      // disconnect();
      router.push('/play');
    },
    [router],
  );

  // Ready event
  const onClickReady1P = useCallback(
    () => {
      if (isReady1P) {
        setIsReady1P(false);
        socket?.emit('unReady');
      } else {
        setIsReady1P(true);
        socket?.emit('ready');
      }
    },
    [isReady1P, socket],
  );

  const onClickReady2P = useCallback(
    () => {
      if (isReady2P) {
        setIsReady2P(false);
        socket?.emit('unReady');
      } else {
        setIsReady2P(true);
        socket?.emit('ready');
      }
    },
    [isReady2P, socket],
  );

  // set isPlaying
  useEffect(() => {
    socket?.on('playing', () => {
      setIsPlaying(true);
      setIsReady1P(false);
      setIsReady2P(false);
    });
    socket?.on('gameover', (data) => {
      console.log('gameover', data);
      setIsPlaying(false);
      setIsReady1P(false);
      setIsReady2P(false);
    });
  });

  const onKeyUp = useCallback(
    (e) => {
      e.preventDefault();
      // console.log('keyUP event', e);
      // 방향키 위쪽
      if (e.keyCode === 38) {
        console.log('key up 위');
        socket?.emit('keyUp', e.keyCode);
      // 뱡향키 아래
      } else if (e.keyCode === 40) {
        console.log('key up 아래');
        socket?.emit('keyUp', e.keyCode);
      } else if (e.code === 'Space') {
        console.log('key up space');
      }
    },
    [socket],
  );

  const onKeyDown = useCallback(
    (e) => {
      e.preventDefault();
      // console.log('keydown event', e);
      // 방향키 위쪽
      if (e.keyCode === 38) {
        console.log('key down 위');
        socket?.emit('keyDown', e.keyCode);
      // 뱡향키 아래
      } else if (e.keyCode === 40) {
        console.log('key down 아래');
        socket?.emit('keyDown', e.keyCode);
      } else if (e.code === 'Space') {
        console.log('key down space');
      }
    },
    [socket],
  );

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', onKeyDown);
  }, [onKeyDown, onKeyUp]);

  // [id] 로 이동시키자
  const onKeyPressHandler = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        socket?.emit('gameChat', e.target.value);
      }
    },
    [socket],
  );

  return (
    <div className="flex justify-center">
      {/* game screen */}
      <div className="w-3/4 pb-1/2 bg-sky-100 relative">
        <GameScreen
          isReady1P={isReady1P}
          isReady2P={isReady2P}
          onClickReady1P={onClickReady1P}
          onClickReady2P={onClickReady2P}
          initData={initData}
          updateData={updateData}
          isPlaying={isPlaying}
        />
      </div>
      {/* info screen */}
      <div className="w-1/4 bg-amber-100">
        {/* 제목이 수평 기준으로 center 정렬이 되는데, 수직기준으로 center 정렬이 안됩니다... 어찌하는 거지?! */}
        <div className="bg-gray-400 h-1/12 text-center">
          <div>
            {`# ${roomNumber} 방제목 api 로 받아서 사용하시오`}
          </div>
        </div>
        <div className="bg-red-300 h-1/4">
          {/* player Info */}
          <PlayerInfo player1="mykang" player2="kycho" />
        </div>
        <div className="bg-green-300 h-1/12">
          {/* play room buttons */}
          {/* 3button opt & replace & exit */}
          <RoomButtonList onClickExit={onClickExit} />
        </div>
        <div className="bg-sky-300 h-7/12">
          {/* participant chatting swap button */}
          <div className="flex h-1/12 text-center">
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
                <ChatInputBox
                  onKeyPressHandler={onKeyPressHandler}
                />
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
