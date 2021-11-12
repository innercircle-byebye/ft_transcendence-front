import { useRouter } from 'next/router';
import {
  useCallback, useEffect, useState,
} from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import useSWR from 'swr';
import GameScreen from '@/components/play-room-page/GameScreen';
import RoomButtonList from '@/components/play-room-page/RoomButtonList';
import PlayerInfo from '@/components/play-room-page/PlayerInfo';
import useSocket from '@/hooks/useSocket';
import {
  IGameChat, IGameRoom, IGameRoomData, IGameUpdateData, IParticipant,
} from '@/typings/db';
import ChatInputBox from '@/components/play-room-page/ChatInputBox';
import useInput from '@/hooks/useInput';
import GameChatList from '@/components/play-room-page/GameChatList';
import ParticipantList from '@/components/play-room-page/ParticipantList';
import setParticipantListData from '@/utils/setParticipantListData';
import GameResultModal from '@/components/play-room-page/GameResult';
import ChatTwoButtonModal from '@/components/chat-page/common/ChatTwoButtonModal';
import GameOptionModal from '@/components/play-room-page/GameOptionModal';
import fetcher from '@/utils/fetcher';

const Room = ({
  userInitialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const roomNumber = router.query.id;
  const [isChatting, setIsChatting] = useState(true);
  const { socket, disconnect } = useSocket('game');
  // const [initData, setInitData] = useState<IGameScreenData | null>(null);
  // const [gameRoomData, setGameRoomData] = useState<IGameRoomData>();
  const [updateData, setUpdateData] = useState<IGameUpdateData[] | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameChat, onChangeGameChat, setGameChat] = useInput('');
  // player Info
  const [name1P, setName1P] = useState<string>('');
  const [name2P, setName2P] = useState<string>('');
  const [isReady1P, setIsReady1P] = useState(false);
  const [isReady2P, setIsReady2P] = useState(false);
  // const [info1P, setInfo1P] = useState<IUser>();
  // const [info2P, setInfo2P] = useState<IUser>();
  // my role
  const [myRole, setMyRole] = useState<string>('');
  // participant data
  const [participantData, setParticipantData] = useState<IParticipant[]>([]);
  // game result modal
  const [gameResultMessage, setGameResultMessage] = useState<string>('');
  const [isShowGameResultModal, setIsShowGameResultModal] = useState<boolean>(false);
  // game room exit modal
  const [isShowExitRoomModal, setIsShowExitRoomModal] = useState<boolean>(false);
  // game option modal
  const [isShowGameOptionModal, setIsShowGameOptionModal] = useState<boolean>(false);

  useEffect(() => {
    // initSetting -> gameRoomData
    socket?.on('gameRoomData', (data: IGameRoomData) => {
      console.log('gameRoomData', data);
      setName1P(data.participants.player1.nickname);
      setName2P(data.participants.player2.nickname);
      setMyRole(data.role);
      if (data.isPlaying) {
        setIsPlaying(true);
      }
      if (data.player1Ready) {
        setIsReady1P(true);
      }
      if (data.player2Ready) {
        setIsReady2P(true);
      }
      // set participant data
      setParticipantListData(setParticipantData, data);
    });
    socket?.emit('joinGameRoom', {
      roomId: router.query.id,
      userId: userInitialData.userId,
    });
    return () => {
      disconnect();
    };
  }, [disconnect, router.query.id, socket, userInitialData.userId]);

  // playing
  useEffect(() => {
    // data update
    socket?.on('update', (data) => setUpdateData(data));
    // console.log('updateData', updateData);
  });

  // not playing
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

  // 나가기 button event handler
  const onClickExit = useCallback(() => {
    // disconnect();
    console.log('일단 버튼은 눌렸다.');
    if (isPlaying && (myRole !== 'observer')) {
      console.log('겜중이고 player');
      setIsShowExitRoomModal(true);
    } else {
      console.log('그냥 나갈 수 있음');
      router.push('/play');
    }
  }, [isPlaying, myRole, router]);

  // 관전하기 참여하기 button event handler
  const onClickMove = useCallback(() => {
    if (myRole === 'observer') {
      socket?.emit('toPlayer');
    } else {
      socket?.emit('toObserver');
    }
  }, [myRole, socket]);

  // 게임 옵션 button event handler
  const onClickOption = useCallback(() => {
    setIsShowGameOptionModal(true);
  }, []);

  // Ready event
  const onClickReady1P = useCallback(() => {
    if (isReady1P) {
      setIsReady1P(false);
      socket?.emit('unReady');
    } else {
      setIsReady1P(true);
      socket?.emit('ready');
    }
  }, [isReady1P, socket]);

  const onClickReady2P = useCallback(() => {
    if (isReady2P) {
      setIsReady2P(false);
      socket?.emit('unReady');
    } else {
      setIsReady2P(true);
      socket?.emit('ready');
    }
  }, [isReady2P, socket]);

  // set isPlaying
  useEffect(() => {
    socket?.on('playing', () => {
      setIsPlaying(true);
      setIsReady1P(false);
      setIsReady2P(false);
    });
    socket?.on('gameover', (data) => {
      console.log('gameover', data);
      // 기존에 열려있을 수 있는 모든 modal 창 닫기
      setIsShowGameResultModal(false);
      setIsShowExitRoomModal(false);

      setIsPlaying(false);
      setIsReady1P(false);
      setIsReady2P(false);
      setGameResultMessage(data);
      setIsShowGameResultModal(true);
    });
  }, [socket]);

  // game result modal button event handler
  const onClickOKButton = useCallback(() => {
    setIsShowGameResultModal(false);
  }, []);

  // game room exit modal button event handler
  const onClickExitRoomButton = useCallback(() => {
    setIsShowExitRoomModal(false);
    router.push('/play');
  }, [router]);

  // game option
  const { data: gameRoomData } = useSWR<IGameRoom>(`/api/game/room/${roomNumber}`, fetcher);

  const [ballSpeed, setBallSpeed] = useState<string>('medium');
  console.log(ballSpeed);

  const onClickGameOptionApplyButton = useCallback(() => {
    setIsShowGameOptionModal(false);
  }, []);

  const onClickGameOptionCancleButton = useCallback(() => {
    setIsShowGameOptionModal(false);
  }, []);

  const onClickNoExitRoomButton = useCallback(() => {
    setIsShowExitRoomModal(false);
  }, []);

  const onKeyUp = useCallback(
    (e) => {
      e.preventDefault();
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
      // 방향키 위쪽
      if (e.keyCode === 38) {
        console.log('key down 위');
        socket?.emit('keyDown', e.keyCode);
        // 뱡향키 아래
      } else if (e.keyCode === 40) {
        console.log('key down 아래');
        socket?.emit('keyDown', e.keyCode);
      }
    },
    [socket],
  );

  // enter key press event handler
  const onKeyPressHandler = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (gameChat && gameChat.trim()) {
          socket?.emit('gameChat', { content: gameChat });
          setGameChat('');
        }
      }
    },
    [gameChat, setGameChat, socket],
  );

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', onKeyDown);
  }, [onKeyDown, onKeyUp]);

  const [gameChatListData, setGameChatListData] = useState<IGameChat[]>([]);

  // chat event 받아오기
  useEffect(() => {
    socket?.on('gameChat', (data: IGameChat) => {
      // gameChatList 추가
      setGameChatListData([...gameChatListData, data]);
    });
  }, [gameChatListData, socket]);

  return (
    <div className="flex justify-center">
      {/* game screen */}
      <div className="w-3/4 pb-1/2 bg-sky-100 relative">
        <GameScreen
          isReady1P={isReady1P}
          isReady2P={isReady2P}
          onClickReady1P={onClickReady1P}
          onClickReady2P={onClickReady2P}
          name1p={name1P}
          name2p={name2P}
          role={myRole}
          updateData={updateData}
          isPlaying={isPlaying}
        />
      </div>
      {/* info screen */}
      <div className="w-1/4 bg-amber-100">
        {/* 제목이 수평 기준으로 center 정렬이 되는데, 수직기준으로 center 정렬이 안됩니다... 어찌하는 거지?! */}
        <div className="bg-gray-400 h-1/12 flex text-center justify-center items-center">
          <div>{`# ${roomNumber} ${gameRoomData?.title}`}</div>
        </div>
        <div className="bg-red-300 h-1/4">
          {/* player Info */}
          <PlayerInfo player1={name1P} player2={name2P} />
          {/* 향후 전적 정보도 포함해주기 */}
        </div>
        <div className="bg-green-300 h-1/12">
          {/* play room buttons */}
          {/* 3button opt & replace & exit */}
          <RoomButtonList
            myRole={myRole}
            isPlaying={isPlaying}
            onClickExit={onClickExit}
            onClickMove={onClickMove}
            onClickOption={onClickOption}
          />
        </div>
        <div className="bg-sky-300 h-7/12">
          {/* participant chatting swap button */}
          <div className="flex h-1/12 text-center">
            <button
              type="button"
              onClick={() => setIsChatting(true)}
              className={`w-1/2 ${isChatting && 'bg-sky-200'} ${
                !isChatting && 'bg-gray-400'
              }`}
            >
              chatting
            </button>
            <button
              type="button"
              onClick={() => setIsChatting(false)}
              className={`w-1/2 ${!isChatting && 'bg-sky-200'} ${
                isChatting && 'bg-gray-400'
              }`}
            >
              participant
            </button>
          </div>
          <div className="h-11/12">
            {isChatting ? (
              <div className="h-full">
                <GameChatList gameChatList={gameChatListData} />
                <ChatInputBox
                  onKeyPressHandler={onKeyPressHandler}
                  gameChat={gameChat}
                  onChangeGameChat={onChangeGameChat}
                />
              </div>
            ) : (
              <div className="h-full">
                <ParticipantList participantData={participantData} />
              </div>
            )}
          </div>
        </div>
      </div>
      {isShowGameResultModal && (
        <GameResultModal
          gameResult={gameResultMessage}
          onClickExitButton={onClickOKButton}
        />
      )}
      {isShowExitRoomModal && (
        <ChatTwoButtonModal
          question="진짜 나가려고?"
          onClickYes={onClickExitRoomButton}
          onClickNo={onClickNoExitRoomButton}
          yesButtonColor="bg-red-300"
          noButtonColor="bg-green-300"
        />
      )}
      {isShowGameOptionModal && (
        <GameOptionModal
          onClickGameOptionApplyButton={onClickGameOptionApplyButton}
          onClickGameOptionCancleButton={onClickGameOptionCancleButton}
          gameRoomData={gameRoomData}
          setBallSpeed={setBallSpeed}
        />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

export default Room;
